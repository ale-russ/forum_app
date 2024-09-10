import React from "react";
import CreatePost from "./post/CreatePost";
import SmallBaches from "./SmallBaches";

import { useForum } from "../utils/PostContext";
import PostComponent from "./post/PostComponent";

const CenterSide = () => {
  const { threads } = useForum();
  return (
    <form className="w-full h-full flex flex-col items-start gap-4 space-x-1 m-3 mb-6 rounded-lg  py-2 pr-4">
      <SmallBaches />
      <CreatePost />

      <>
        {threads ? (
          threads?.map((post, index) => (
            <PostComponent key={index} post={post} />
          ))
        ) : (
          <p>No Post Found</p>
        )}
      </>
    </form>
  );
};

export default CenterSide;
