import React from "react";

const ProfileImage = ({ author }) => {
  return (
    <>
      {author?.profileImage ? (
        <img
          src={author?.profileImage}
          className="mr-2 h-10 w-10 rounded-full border border-stone-600 border-opacity-30 object-fill"
          alt="User Profile"
        />
      ) : (
        <div className="mr-2 h-10 w-10 rounded-full border border-stone-600 border-opacity-30 flex items-center justify-center light-search">
          {author?.userName?.charAt(0).toUpperCase()}
        </div>
      )}
    </>
  );
};

export default ProfileImage;
