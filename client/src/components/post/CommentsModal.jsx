import React, { useEffect, useRef, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";

import { ReactComponent as ProfileImage } from "../../assets/ProfileImage.svg";
import { host } from "../../utils/ApiRoutes";
import ModalWrapper from "../common/ModalWrapper";

const socket = io(host);

const CommentsModal = ({
  setShowModal,
  socketComment,
  setCommentInput,
  commentInput,
  handleLocalAddComment,
  post,
}) => {
  return (
    <ModalWrapper
      post={post}
      setShowModal={setShowModal}
      children={
        <>
          <div className="flex flex-col items-start overflow-y-auto scrollbar custom-scrollbar mx-1 flex-grow w-full">
            {socketComment?.map((comment, index) => (
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
          </div>

          <div className="flex items-center w-full p-4 border-t border-gray-700">
            <ProfileImage className="rounded-full object-fill mx-4" />
            <textarea
              className="flex items-center light-search h-16 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-[70%] md:w-[80%] lg:w-[80%] my-2"
              type="text"
              placeholder="Add a comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLocalAddComment(e);
                }
              }}
            />
          </div>
        </>
      }
    />
  );
};

export default CommentsModal;
