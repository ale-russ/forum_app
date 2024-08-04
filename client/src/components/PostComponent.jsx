import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";

import { useForum } from "../utils/PostContext";
import { ReactComponent as ProfileImage } from "../assets/ProfileImage.svg";
import { likePost } from "../controllers/ForumController";

const PostComponent = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const { handleAddComment, threads, setThreads } = useForum();
  const { token } = localStorage.getItem("token");
  const [comments, setComments] = useState([]);

  const sortComments = (comments) => {
    return comments.sort((a, b) => {
      if (a.author.userName !== b.author.userName) {
        return a.author.userName.localeCompare(b.author.userName);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  };

  console.log("token: ", token);
  return (
    <div className="dark-navbar flex items-start h-48 rounded-lg shadow-lg w-full py-3  px-4 ">
      <div className="rounded-lg bg-green-500 w-52 h-full ">Image</div>
      <div className="flex items-start flex-col justify-between w-full h-full px-2 ">
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex items-center justify-between w-full  ">
            <div className="line-clamp-2">
              {post?.title} : {post?.content}
            </div>
            <div
              onClick={async () =>
                await likePost({ id: post?._id, token: token })
              }
            >
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
              <div className="font-bold text-sm">{post?.author.userName}</div>
              <div className="text-[10px] text-[#C5D0E6]">3 days ago</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#C5D0E6] w-[50%]">
            <div className="flex flex-wrap">244,567 View</div>
            <div className="flex flex-wrap">244,567 Likes</div>
            <div
              className="flex flex-wrap items-center justify-center hover:cursor-pointer"
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
        <div className="flex flex-col items-center fixed inset-0 z-50 outline-none focus:outline-none bg-gray-700 opacity-[96%] shadow-2xl">
          <div className="flex flex-col items-center outline-none focus:outline-none dark shadow-2xl w-[80%] md:w-[70%] lg:w-[35%] h-[70%] m-auto rounded-3xl overflow-hidden">
            <div className="w-full flex items-center justify-between px-4 my-3">
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

            <div className="flex flex-col items-start overflow-y-auto scrollbar custom-scrollbar mx-1 flex-grow w-full">
              {sortComments(comments)?.map((comment, index, sortedComments) => {
                const showUsername =
                  index === 0 ||
                  comment.author.userName !==
                    sortedComments[index - 1].author.userName;
                return (
                  <div
                    key={comment?._id}
                    className="flex flex-row items-start my-2 w-full"
                  >
                    <div className="h-2 w-2 mx-2 mt-1">
                      {showUsername && (
                        <ProfileImage className="rounded-full object-fill" />
                      )}
                    </div>
                    <div className="dark-search text-[13px] rounded-xl shadow-stone-900 shadow-lg py-1 px-3 ml-8 mr-5 w-[90%]">
                      {showUsername && (
                        <h1 className="text-sm italic">
                          {comment?.author.userName}
                        </h1>
                      )}
                      <p className="w-full">{comment?.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center w-full p-4 border-t border-gray-700">
              <ProfileImage className="rounded-full object-fill mx-4" />
              <textarea
                className="flex items-center dark-search h-16 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-[70%] md:w-[80%] lg:w-[80%] my-2"
                type="text"
                placeholder="Add a comment"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddComment(post, e, token, setThreads, threads);
                    // handleAddComment(e);
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
