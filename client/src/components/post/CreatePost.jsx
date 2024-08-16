import React, { useContext, useState } from "react";

import { ReactComponent as ProfileImage } from "../../assets/ProfileImage.svg";
import { useForum } from "../../utils/PostContext";
import UploadImages from "../common/UploadImage";
const CreatePost = () => {
  // const user = localStorage.getItem("currentUser");
  const { newPost, setNewPost, handleCreatePost, user } = useForum();

  return (
    <div className="light-navbar flex items-start md:items-center lg:items-center xl:items-center rounded-lg px-4 w-full py-4 drop-shadow-lg">
      {/* <ProfileImage className="rounded-full h-auto object-fill mr-4" /> */}
      <img
        src={user.userProfileImage}
        className="mr-2 h-10 w-10 rounded-full border border-stone-600 border-opacity-30 object-fill"
        alt="User Profile"
      />
      <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row  items-center gap-x-4  w-full">
        <div className="flex flex-col gap-y-4 w-full">
          <input
            type="text"
            className="light-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg"
            placeholder="Title"
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            type="text"
            className="flex items-center light-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg"
            placeholder="What's on your mind?"
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />
          {/* <UploadImage /> */}
        </div>
        <button
          className="rounded bg-[#FF571A] h-10 text-sm px-3 my-2 shadow-lg text-white drop-shadow-lg"
          onClick={handleCreatePost}
        >
          Create Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
