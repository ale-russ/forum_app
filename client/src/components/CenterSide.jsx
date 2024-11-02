import React, { useState, useEffect } from "react";
import CreatePost from "./post/CreatePost";
import SmallBaches from "./SmallBaches";

import { useForum } from "../utils/PostContext";
import PostComponent from "./post/PostComponent";
import Footer from "./common/Footer";

const CenterSide = () => {
  const { threads } = useForum();

  return (
    <form className="w-full h-full flex flex-col items-start gap-4 space-x-1 mx-3 mb-6 rounded-lg  py-2 pr-4">
      <SmallBaches />
      <CreatePost />

      <>
        {threads ? (
          threads?.map((post, index) => (
            <PostComponent key={post._id} post={post} />
          ))
        ) : (
          <p>No Post Found</p>
        )}
      </>
      <Footer />
    </form>
  );
};

export default CenterSide;
