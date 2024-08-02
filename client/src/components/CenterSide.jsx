import React from "react";
import CreatePost from "./CreatePost";
import SmallBaches from "./SmallBaches";
import PostComponent from "./PostComponent";
import { useForum } from "../utils/PostContext";

const CenterSide = () => {
  const { threads } = useForum();
  return (
    <form className="w-full h-full md:w-[70%] lg:w-[70%] xl:w-[70%] flex flex-col items-start gap-4 space-x-1  m-3 rounded-lg  py-2 pr-4">
      <SmallBaches />
      <CreatePost />
      {threads ? (
        threads?.map((post, index) => <PostComponent key={index} post={post} />)
      ) : (
        <p>No Post Found</p>
      )}
    </form>
  );
};

export default CenterSide;
