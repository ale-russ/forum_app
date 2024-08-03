import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";

import { useForum } from "../utils/PostContext";
import { ReactComponent as ProfileImage } from "../assets/ProfileImage.svg";

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
  const [comments, setComments] = useState([]);

  console.log("Post: ", post);
  return (
    <div className="dark-navbar flex items-start h-48 rounded-lg shadow-lg w-full py-3  px-4 ">
      <div className="rounded-lg bg-green-500 w-52 h-full ">Image</div>
      <div className="flex items-start flex-col justify-between w-full h-full px-2 ">
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex items-center justify-between w-full  ">
            <div className="line-clamp-2">
              {post?.title} : {post?.content}
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
              <div className="font-bold text-lg">{post?.author.userName}</div>
              <div className="text-[10px] text-[#C5D0E6]">3 days ago</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#C5D0E6] w-[50%]">
            <div>244,567 View</div>
            <div>244,567 Likes</div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                if (post?.comments != null)
                  setComments(() => [...post?.comments]);
                setShowModal(!showModal);
              }}
            >
              {post.comments?.length} Comments
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <div className="flex flex-col overflow-x-hidden overflow-y-auto items-center fixed inset-0 z-50 outline-none focus:outline-none bg-gray-700 opacity-[96%] shadow-2xl">
          <div className="flex flex-col  items-center outline-none focus:outline-none dark shadow-2xl w-[80%] md:w-[70%] lg:w-[35%] h-[70%] m-auto rounded-3xl overflow-hidden">
            <div className=" w-full flex items-center justify-between px-4 my-3">
              <div className="w-full flex justify-center items-center">
                <h4 className="text-[#FF571A] font-bold">Comments</h4>
              </div>
              <div
                className="flex items-center justify-center m-auto rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
                onClick={() => setShowModal(false)}
              >
                X
              </div>
            </div>

            <div className="flex flex-col items-start overflow-x-hidden overflow-y-auto scrollbar custom-scrollbar mx-1">
              <>
                {comments?.map((comment, index) => (
                  <div className="flex flex-row items-start my-2 ">
                    <div className="h-2 w-2 mx-2 mt-1">
                      <ProfileImage className="rounded-full object-fill" />
                    </div>
                    <div className="dark-search text-[13px] rounded-2xl shadow-stone-900 shadow-lg  py-1 px-3 ml-8 mr-5 ">
                      <h1 className="text-sm">{comment?.author.userName}</h1>
                      <p key={comment?._id}>{comment?.content}</p>
                    </div>
                  </div>
                ))}
              </>
            </div>
            <div className="flex items-center w-full ">
              <ProfileImage className="rounded-full object-fill mx-4" />
              <textarea
                className="flex items-center  dark-search h-16 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-[80%] my-2"
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
