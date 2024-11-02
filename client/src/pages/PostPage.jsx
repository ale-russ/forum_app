import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";

import { useForum } from "../utils/PostContext";
import HomeWrapper from "../components/common/HomeWrapper";
import ProfileImage from "../components/common/ProfileImage";
import useCloseModal from "../hooks/useCloseModal.js";
import EmojiPickerComponent from "../components/common/EmojiPicker.jsx";
import { useSocket } from "../utils/SocketContext.jsx";

const PostPage = () => {
  const location = useLocation();
  const { post } = location.state || {};
  const socket = useSocket();
  const {
    postComments,
    setPostComments,
    user,
    handleLikePost,
    handleFetchPosts,
  } = useForum();

  const [showPicker, setShowPicker] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [localCommentCount, setLocalCommentCount] = useState(
    post?.comments?.length || 0
  );
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(user._id));
  const pickerRef = useRef(null);

  const [localPost, setLocalPost] = useState(post);

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

  const handleLocalAddComment = async () => {
    const content = commentInput.trim();
    if (!content) return;
    if (content) {
      const newComment = {
        postId: localPost?._id,
        author: user._id,
        content: commentInput,
      };

      if (newComment) {
        socket?.emit("new comment", newComment);
        setLocalCommentCount((prevCount) => prevCount + 1);
        setCommentInput("");
      }
    }
  };

  useCloseModal(pickerRef, () => setShowPicker(false));

  useEffect(() => {
    if (localPost?.comments) {
      setPostComments(localPost?.comments);
    }
  }, [localPost?.comments]);

  useEffect(() => {
    if (localPost?._id) {
      socket?.emit("join room", localPost?._id);
    }

    socket?.on("new comment", ({ updatedPost }) => {
      console.log("updatedPost: ", updatedPost);
      if (localPost?._id === updatedPost._id) {
        setLocalPost({ ...updatedPost });
      }
    });

    handleFetchPosts();

    return () => {
      if (localPost?._id) {
        socket?.emit("leave room", localPost?._id);
      }
      socket?.off("new comment");
    };
  }, [localPost?._id]);

  return (
    <HomeWrapper
      children={
        <div className="flex py-2 h-full w-full ">
          <div className="light-navbar flex flex-col items-center outline-none focus:outline-none light shadow-2xl w-full lg:w-[80%] xl:w-[50%] max-h-[70%] m-x-auto rounded-3xl overflow-x-hidden overflow-y-auto scrollbar custom-scrollbar px-4 m-auto">
            <div className="flex items-center justify-center w-full h-10 font-bold uppercase">
              {localPost?.title}
            </div>
            <div className="flex py-3 text-justify">{localPost?.content}</div>
            <div className="flex items-center justify-between mb-3 w-full">
              <div className="light-search flex flex-col md:flex-row lg:flex-row xl:flex-row items-center p-2 rounded-lg shadow-xl">
                <ProfileImage author={localPost?.author} />
                <p>{localPost?.author.userName}</p>
              </div>
              <div className="flex items-center justify-between w-[50%] flex-wrap  text-sm">
                <div className="flex flex-col items-center">
                  {localPost?.views?.length > 0 ? (
                    <p> {localPost?.views?.length} </p>
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
                  {localPost?.comments?.length > 0 ? (
                    <p> {localPost?.comments?.length} </p>
                  ) : (
                    <p>0 </p>
                  )}
                  Comments
                </div>
              </div>
            </div>
            <div className="relative flex items-center light-search my-2 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-full px-3">
              <EmojiPickerComponent
                pickerRef={pickerRef}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                setInput={setCommentInput}
              />
              <textarea
                className="flex items-center light-search h-10 focus:outline-none  outline-none border-0 w-full my-2"
                type="text"
                placeholder="Add a comment"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <IoMdSend
                className="w-5 h-5 cursor-pointer ml-3"
                onClick={handleLocalAddComment}
              />
            </div>
            <div className="w-full my-2 flex-col gap-y-2">
              {postComments &&
                postComments?.map((comment) => (
                  <div
                    key={comment?._id}
                    className="rounded shadow-lg light-search my-3 px-3"
                  >
                    <div className="italic">{comment?.author?.userName}</div>
                    {comment?.content}
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
