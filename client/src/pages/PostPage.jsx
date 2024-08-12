import React from "react";
import { useLocation, useParams } from "react-router-dom";

import LeftSide from "../components/LeftSideBar";

const PostPage = () => {
  const location = useLocation();
  const { post } = location.state || {};
  const { id } = useParams();

  return (
    <div className="flex items-center justify-center p-2outline-none focus:outline-none opacity-[96%] shadow-2xl">
      <LeftSide />
      <div className="light-navbar flex flex-col items-center outline-none focus:outline-none light shadow-2xl w-[80%] md:w-[70%] lg:w-[35%] h-[70%] m-auto rounded-3xl overflow-hidden">
        {post?.title}
      </div>
    </div>
  );
};

export default PostPage;
