import React, { useState, useEffect } from "react";
import CreatePost from "./post/CreatePost";
import SmallBaches from "./SmallBaches";

import { useForum } from "../utils/PostContext";
import PostComponent from "./post/PostComponent";

const CenterSide = () => {
  const { threads } = useForum();
  const [newPosts, setNewPosts] = useState([]);
  const sortNewPosts = () => {
    const sortedPosts = [...threads].sort((a, b) => {
      const aTimestamp = Date.parse(a.createdAt);
      const bTimestamp = Date.parse(b.createdAt);
      return bTimestamp - aTimestamp;
    });

    setNewPosts(sortedPosts);
  };
  useEffect(() => {
    sortNewPosts();
  }, [threads]);
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
