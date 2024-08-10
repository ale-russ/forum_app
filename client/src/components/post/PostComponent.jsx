import React, { useEffect, useRef, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";

import { useForum } from "../../utils/PostContext";
import { ReactComponent as ProfileImage } from "../../assets/ProfileImage.svg";
import CommentsModal from "./CommentsModal";
import { host } from "../../utils/ApiRoutes";

const socket = io(host);

const PostComponent = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const { handleLikePost } = useForum();
  const [localCommentCount, setLocalCommentCount] = useState(
    post.comments?.length || 0
  );

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
              onClick={() => handleLikePost(post)}
            >
              <CiHeart />
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
            <div className="flex flex-wrap">{post?.likes?.length} Likes</div>
            <div
              className="flex flex-wrap items-center justify-center hover:cursor-pointer"
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              {localCommentCount} Comments
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
