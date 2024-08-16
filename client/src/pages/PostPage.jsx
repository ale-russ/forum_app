import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

import LeftSide from "../components/LeftSideBar";
import { ReactComponent as Profile } from "../assets/ProfileImage.svg";
import { useForum } from "../utils/PostContext";
import { host } from "../utils/ApiRoutes";
import HomeWrapper from "../components/common/HomeWrapper";

const socket = io(host);

const PostPage = () => {
  const location = useLocation();
  const { post } = location.state || {};
  const [showPicker, setShowPicker] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const { postComments, setPostComments, user, handleLikePost } = useForum();
  const [localCommentCount, setLocalCommentCount] = useState(
    post.comments?.length || 0
  );
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));

  const addEmoji = (e) => {
    const emoji = e.emoji;
    setCommentInput((prevInput) => prevInput + emoji);
  };

  const handleLike = async () => {
    try {
      const updatedPost = await handleLikePost(post._id);
      setIsLiked(updatedPost?.likes.includes(user._id));
      setLikeCount(updatedPost?.likes?.length);
    } catch (err) {
      console.error("Error updating like:", err);
      toast.error("Failed to update like", toastOptions);
    }
  };

  const handleLocalAddComment = async (comment) => {
    const content = comment;
    console.log("new comment is ", comment);
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

    return () => {
      socket.off("new comment");
    };
  }, [post._id]);

  return (
    <HomeWrapper
      children={
        <div className="flex py-2 h-full w-full">
          <div className="light-navbar flex flex-col items-center outline-none focus:outline-none light shadow-2xl w-full lg:w-[80%] xl:w-[50%] max-h-[70%] m-x-auto rounded-3xl overflow-x-hidden overflow-y-auto scrollbar custom-scrollbar px-4 m-auto">
            <div className="flex items-center justify-center w-full h-10">
              {post?.title}
            </div>
            <div className="flex py-3 text-justify">
              {post?.content}
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </div>
            <div className="flex items-center justify-between mb-3 w-full">
              <div className="light-search flex flex-col md:flex-row lg:flex-row xl:flex-row items-center p-2 rounded-lg shadow-xl">
                <Profile className="rounded-full h-auto object-fill mr-4 shadow-xl" />
                <p className="ml-2">{post.author.userName}</p>
              </div>
              <div className="flex items-center justify-between w-[50%] flex-wrap">
                <div className="flex flex-col items-center">
                  {post.views?.length > 0 ? (
                    <p> {post?.views?.length} </p>
                  ) : (
                    <p>0 </p>
                  )}
                  Views
                </div>
                <div className="flex flex-col items-center">
                  {likeCount > 0 ? <p> {likeCount} </p> : <p>0 </p>}
                  likes
                </div>
                <div className="flex flex-col items-center">
                  {post.comments?.length > 0 ? (
                    <p> {post?.comments?.length} </p>
                  ) : (
                    <p>0 </p>
                  )}
                  Comments
                </div>
              </div>
            </div>
            <div className="relative flex items-center light-search my-2 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-full px-3">
              <span
                className="cursor-pointer m-auto hover:text-[#FF571A] mr-1"
                onClick={() => setShowPicker((val) => !val)}
              >
                <BsEmojiSmile />
              </span>
              {showPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50 inset-auto">
                  <Picker
                    onEmojiClick={addEmoji}
                    className={` transition ease-in-out duration-300 ${
                      showPicker ? "open-animation" : "close-animation"
                    }`}
                  />
                </div>
              )}
              <textarea
                className="flex items-center light-search h-10 focus:outline-none  outline-none border-0 w-full my-2"
                type="text"
                placeholder="Add a comment"
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <IoMdSend
                className="w-5 h-5 cursor-pointer ml-3"
                onClick={() => handleLocalAddComment(commentInput)}
              />
            </div>
            <div className="w-full my-2 flex-col gap-y-2">
              {postComments &&
                postComments?.map((comment) => (
                  <div
                    key={comment._id}
                    className="rounded shadow-lg light-search my-3 px-3"
                  >
                    <div className="italic">{comment?.author?.userName}</div>
                    {comment.content}
                  </div>
                ))}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default PostPage;
