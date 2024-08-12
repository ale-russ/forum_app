import React from "react";
import { useLocation, useParams } from "react-router-dom";

import LeftSide from "../components/LeftSideBar";
import { ReactComponent as Profile } from "../assets/ProfileImage.svg";

const PostPage = () => {
  const location = useLocation();
  const { post } = location.state || {};
  const { id } = useParams();

  return (
    <div className="flex items-center p-2 outline-none focus:outline-none opacity-[96%] shadow-2xl h-full w-full">
      <LeftSide />
      <div className="light-navbar flex flex-col items-center outline-none focus:outline-none light shadow-2xl w-full h-[70%] m-auto rounded-3xl overflow-x-hidden overflow-y-auto scrollbar custom-scrollbar mx-3">
        <div className="flex items-center justify-center w-full h-10">
          {post?.title}
        </div>
        <div className="flex py-3 px-4 text-justify">
          {post?.content}
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </div>
        <div className="flex items-center justify-between mb-3 w-full px-2">
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
              {post.likes?.length > 0 ? (
                <p> {post?.likes?.length} </p>
              ) : (
                <p>0 </p>
              )}
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
        <div className="w-full px-4 my-2 flex-col gap-y-2">
          {post?.comments &&
            post?.comments?.map((comment) => (
              <div className="rounded shadow-lg light-search my-3 px-3">
                <div className="italic">{comment.author.userName}</div>
                {comment.content}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
