import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

import { ReactComponent as ProfileImage } from "../../assets/ProfileImage.svg";
import { host } from "../../utils/ApiRoutes";
import ModalWrapper from "../common/ModalWrapper";
import { useForum } from "../../utils/PostContext";

const socket = io(host);

const CommentsModal = ({
  setShowModal,
  post,
  localCommentCount,
  setLocalCommentCount,
}) => {
  const [commentInput, setCommentInput] = useState("");
  const { postComments, setPostComments, user, handleSinglePost } = useForum();
  const [showPicker, setShowPicker] = useState(false);
  const [localPostComments, setLocalPostComments] = useState([]);
  const commentEndRef = useRef(null);

  const scrollToBottom = () => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addEmoji = (e) => {
    const emoji = e.emoji;
    setCommentInput((prevInput) => prevInput + emoji);
  };

  // useEffect(() => scrollToBottom, [localCommentCount]);
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 0);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [localCommentCount, postComments]);

  const handleLocalAddComment = async (comment) => {
    const content = comment;
    if (!content) return;
    if (commentInput.trim()) {
      const newComment = {
        postId: post._id,
        author: user.userId,
        content: commentInput,
      };
      if (newComment) {
        socket.emit("new comment", newComment);
        setLocalCommentCount((prevCount) => prevCount + 1);
      }
      setCommentInput("");
    }
  };

  useEffect(() => {
    if (post?._id) {
      socket.emit("join room", post._id);
    }

    return () => {
      if (post?._id) {
        socket.emit("leave room", post._id);
      }
    };
  }, [post?._id]);

  useEffect(() => {
    if (post?.comments) {
      setPostComments(post.comments);
    }
  }, [post?.comments]);

  useEffect(() => {
    socket.on("new comment", ({ comment, id }) => {
      setPostComments((prevComments) => {
        if (post._id === id) {
          return [...prevComments, comment];
        }
        return prevComments;
      });
    });

    // handleSinglePost(post._id);

    return () => {
      socket.off("new comment");
    };
  }, [post._id]);

  return (
    <ModalWrapper
      post={post}
      setShowModal={setShowModal}
      children={
        <>
          <div className="flex flex-col items-start overflow-y-auto scrollbar custom-scrollbar mx-1 flex-grow w-full">
            {postComments?.map((comment, index) => (
              <div
                key={index}
                className="flex flex-row items-start my-2 w-full"
              >
                <div className="light-search text-[13px] rounded-lg shadow-lg py-1 px-3 ml-8 mr-5 w-[90%]">
                  {/* {comment.author._id !== user.userId && ( */}
                  <h1 className="text-sm italic font-bold">
                    {comment.author?.userName}
                  </h1>
                  {/* )} */}
                  {/* {comment.map((comment, commentIndex) => ( */}
                  <p className="w-full">{comment?.content}</p>
                  {/* ))} */}
                </div>
              </div>
            ))}
            <div ref={commentEndRef} />
          </div>
          <div className=" relative flex items-center w-full p-4 border-t border-gray-700">
            <ProfileImage className="rounded-full object-fill mx-4" />
            <span
              className="cursor-pointer m-auto hover:text-[#FF571A] mr-1"
              onClick={() => setShowPicker((val) => !val)}
            >
              <BsEmojiSmile />
            </span>
            {showPicker && (
              <div className="absolute bottom-full left-0 mb-2">
                <Picker
                  onEmojiClick={addEmoji}
                  className={` transition ease-in-out duration-300 ${
                    showPicker ? "open-animation" : "close-animation"
                  }`}
                />
              </div>
            )}
            <textarea
              className="flex items-center light-search h-16 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-[70%] md:w-[80%] lg:w-[80%] my-2"
              type="text"
              placeholder="Add a comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (e.target.value.trim())
                    handleLocalAddComment(commentInput);
                }
              }}
            />
            <IoMdSend
              className="w-5 h-5 cursor-pointer ml-3"
              onClick={() => handleLocalAddComment(commentInput)}
            />
          </div>
        </>
      }
    />
  );
};

export default CommentsModal;
