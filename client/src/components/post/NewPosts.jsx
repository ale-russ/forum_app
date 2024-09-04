import React, { useEffect, useState } from "react";

import { useForum } from "../../utils/PostContext";
import PostComponent from "./PostComponent";

const NewPosts = () => {
  const { threads } = useForum();
  const [newPosts, setNewPosts] = useState([]);

  const sortNewPosts = () => {
    const sortedPosts = [...threads].sort((a, b) => {
      const aTimestamp = Date.parse(a.createdAt);
      const bTimestamp = Date.parse(b.createdAt);
      return bTimestamp - aTimestamp;
    });

    setNewPosts(sortedPosts.slice(0, 5));
  };

  useEffect(() => {
    sortNewPosts();
  }, [threads]);

  return (
    <div className="w-full h-full flex flex-col items-start gap-4 space-x-1 m-3 mb-6 rounded-lg  py-2 pr-4">
      {newPosts ? (
        newPosts?.map((post, index) => (
          <PostComponent key={index} post={post} />
        ))
      ) : (
        <p>No Post Found</p>
      )}
    </div>
  );
};

export default NewPosts;
