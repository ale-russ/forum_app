import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";

import { useForum } from "../utils/PostContext";
import { ReactComponent as ProfileImage } from "../assets/ProfileImage.svg";
import { postsRoute } from "../utils/ApiRoutes";

const PostComponent = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const {
    handleAddComment,
    loadingComment,
    setLoadingComment,
    threads,
    setThreads,
  } = useForum();
  const { token } = localStorage.getItem("token");
  // console.log("author: ", post);
  console.log("Post: ", post);
  return (
    <div className="dark-navbar flex items-start h-48 rounded-lg shadow-lg w-full py-3  px-4 ">
      <div className="rounded-lg bg-green-500 w-52 h-full ">Image</div>
      <div className="flex items-start flex-col justify-between w-full h-full px-2 ">
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex items-center justify-between w-full  ">
            <div className="line-clamp-2">
              {/* Title of the Post: Let's talk about the impact of AI in our life
              and how we can cope with the advancement of AI, how can we make
              profit from it */}
              {post?.title} : {post.content}
            </div>
            <div>
              <CiHeart />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="text-[#C5D0E6] rounded-lg shadow-lg text-[10px] p-2 dark-search">
              tag of the first tags
            </div>
            <div className="text-[#C5D0E6] rounded-lg shadow-lg text-[10px] p-2 dark-search">
              tag3
            </div>
            <div className="text-[#C5D0E6] rounded-lg shadow-lg text-[10px] p-2 dark-search">
              tag2
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <ProfileImage className="rounded-full h-auto object-fill mr-4" />
            <div className="flex flex-col items-start">
              <div className="font-bold text-lg">{post.author}</div>
              <div className="text-[10px] text-[#C5D0E6]">3 days ago</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#C5D0E6] w-[50%]">
            <div>244,567 View</div>
            <div>244,567 Likes</div>
            <div
              className="hover:cursor-pointer"
              onClick={() => setShowModal(!showModal)}
            >
              {post.comments.length} Comments
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <div className="flex flex-col overflow-x-hidden overflow-y-auto items-center fixed inset-0 z-50 outline-none focus:outline-none dark opacity-[96%] shadow-2xl w-[80%] md:w-[70%] lg:w-[55%] h-[70%] m-auto rounded-3xl">
          <div className="w-full relative my-6 mx-auto px-8 h-full">
            <div
              className="flex items-end justify-end rounded-full border-3 hover:cursor-pointer "
              onClick={() => setShowModal(false)}
            >
              X
            </div>
            <div className="flex flex-col items-center justify-between h-full pb-8">
              <div className="flex flex-col items-center">
                <h4>Comments</h4>
                <div className="rounded-lg shadow-lg border border-gray-700 p-4 m-3 w-">
                  This is the comment section. And checking if the comment can
                  extend its width and height
                  {/* {postsRoute.comments?.map((comment) => (
                <p>This is the first comment for checking</p>
                // (<p key={comment._id}>{comment}</p>)
              ))} */}
                </div>
              </div>
              <input
                className="flex items-center dark-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-full"
                type="text"
                placeholder="Add a comment"
                onKeyDown={(e) => {
                  console.log("Event: ", e.key);
                  if (e.key === "Enter") {
                    handleAddComment(post, e, token, setThreads, threads);
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostComponent;
