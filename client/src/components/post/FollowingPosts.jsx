import React from "react";
import { useForum } from "../../utils/PostContext";

const FollowingPosts = () => {
  const { user } = useForum();
  console.log("User.Following: ", user?.following);
  return (
    <div className="w-full h-full flex flex-col items-start gap-4 space-x-1 m-3 mb-6 rounded-lg  py-2 pr-4">
      FollowingPosts
    </div>
  );
};

export default FollowingPosts;
