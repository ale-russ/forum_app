import React, { useState, useEffect } from "react";
import { useForum } from "../../utils/PostContext";
import PostComponent from "./PostComponent";

const PopularPosts = () => {
  const { threads } = useForum();
  const [popularPosts, setPopularPosts] = useState([]);
  const sortNewPosts = () => {
    const sortedPosts = [...threads].sort((a, b) => a.views - b.views);
    setPopularPosts(sortedPosts.slice(0, 5));
  };

  useEffect(() => {
    sortNewPosts();
  }, [threads]);
  return (
    <div className="w-full h-full flex flex-col items-start gap-4 space-x-1 m-3 mb-6 rounded-lg  py-2 pr-4">
      {popularPosts ? (
        popularPosts?.map((post, index) => (
          <PostComponent key={index} post={post} />
        ))
      ) : (
        <p>No Post Found</p>
      )}
    </div>
  );
};
export default PopularPosts;
