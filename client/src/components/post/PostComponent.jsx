import React, { useEffect, useRef, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

import { useForum } from "../../utils/PostContext";
import { ReactComponent as ProfileImage } from "../../assets/ProfileImage.svg";
import CommentsModal from "./CommentsModal";
import { host } from "../../utils/ApiRoutes";

const socket = io(host);

const PostComponent = ({ post }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { handleLikePost, user } = useForum();
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user.userId));

  const [localCommentCount, setLocalCommentCount] = useState(
    post.comments?.length || 0
  );

  const handleLike = async () => {
    try {
      const updatedPost = await handleLikePost(post._id);
      setIsLiked(updatedPost?.likes.includes(user.userId));
      setLikeCount(updatedPost?.likes?.length);
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  useEffect(() => {
    const handleNewComment = ({ id }) => {
      if (id === post._id) {
        setLocalCommentCount((prevCount) => prevCount + 1);
      }
    };

    socket.on("new comment", handleNewComment);

    return () => {
      socket.off("new comment", handleNewComment);
    };
  }, [post._id]);
  // console.log("Like Count: ", likeCount);
  return (
    <div className="light-navbar flex items-start h-48 rounded-lg shadow-lg w-full py-3 px-4">
      <div className="flex items-start flex-col justify-between w-full h-full px-2 ">
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex items-center justify-between w-full">
            <div className="line-clamp-2 font-bold">
              {post?.title} : {post?.content}
            </div>
            <div
              className="hidden md:block lg:block xl:block"
              onClick={handleLike}
            >
              {isLiked ? (
                <FaHeart
                  className={`cursor-pointer ${isLiked ? "text-red-500" : ""}`}
                />
              ) : (
                <CiHeart className={`cursor-pointer `} />
              )}
            </div>
            <div className="block md:hidden lg:hidden xl:hidden">
              <ProfileImage className="rounded-full h-auto object-fill " />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-lg shadow-lg text-[10px] p-2 light-search">
              tag of the first tags
            </div>
            <div className="rounded-lg shadow-lg text-[10px] p-2 light-search">
              tag3
            </div>
            <div className="rounded-lg shadow-lg text-[10px] p-2 light-search">
              tag2
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="hidden lg:flex md:flex xl:flex items-center">
            <ProfileImage className="rounded-full h-auto object-fill mr-4" />
            <div className="flex flex-col items-start">
              <div className="font-bold text-sm">{post?.author.userName}</div>
              <div className="text-[10px] text-[#48494e]">
                {/* {formatDistanceToNow(new Date(post?.createdAt))} ago */}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#48494e] w-full md:w-[50%] lg:w-[50%] xl:w-[50%]">
            <div className="flex flex-wrap items-center px-2">244,567 View</div>
            <div className="flex flex-wrap cursor-pointer" onClick={handleLike}>
              {likeCount} Likes
            </div>
            <div
              className="flex flex-wrap items-center justify-center hover:cursor-pointer"
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              {localCommentCount} Comments
            </div>
            <div
              className="primary text-white rounded-lg px-2 py-1 text-[13px] cursor-pointer"
              onClick={() =>
                navigate(`/post/:${post._id}`, { state: { post } })
              }
            >
              Read
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <CommentsModal
          setShowModal={setShowModal}
          post={post}
          localCommentCount={localCommentCount}
          setLocalCommentCount={setLocalCommentCount}
        />
      )}
    </div>
  );
};

export default PostComponent;
