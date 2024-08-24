import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

// import { ReactComponent as ProfileImage } from "../../assets/ProfileImage.svg";
import { host } from "../../utils/ApiRoutes";
import ModalWrapper from "../common/ModalWrapper";
import { useForum } from "../../utils/PostContext";
import ProfileImage from "../common/ProfileImage";
import EmojiPickerComponent from "../common/EmojiPicker";
import useCloseModal from "../../hooks/useCloseModal";

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
  const commentModalRef = useRef(null);

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
        author: user._id,
        content: commentInput,
      };
      if (newComment) {
        socket.emit("new comment", newComment);
        setLocalCommentCount((prevCount) => prevCount + 1);
      }
      setCommentInput("");
    }
  };

  useCloseModal(commentModalRef, () => setShowPicker(false));

  useEffect(() => {
    if (post?.comments) {
      setPostComments(post.comments);
    }
  }, [post?.comments]);

  useEffect(() => {
    if (post?._id) {
      socket.emit("join room", post._id);
    }

    socket.on("new comment", ({ comment, id }) => {
      setPostComments((prevComments) => {
        if (post._id === id) {
          return [...prevComments, comment];
        }
        return prevComments;
      });
    });

    return () => {
      if (post?._id) {
        socket.emit("leave room", post._id);
      }
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
                  <h1 className="text-sm italic font-bold">
                    {comment.author?.userName}
                  </h1>

                  <p className="w-full">{comment?.content}</p>
                </div>
              </div>
            ))}
            <div ref={commentEndRef} />
          </div>
          <div className=" relative flex items-center w-full p-4 border-t border-gray-700">
            <ProfileImage author={user} />

            <EmojiPickerComponent
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              pickerRef={commentModalRef}
              setInput={setCommentInput}
            />
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
