import React, { useEffect, useState } from "react";

const ProfileImage = ({ author }) => {
  const [backgroundColor, setBackgroundColor] = useState("");

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    setBackgroundColor(getRandomColor());
  }, []);
  return (
    <>
      {author?.profileImage ? (
        <img
          src={author?.profileImage}
          className="mr-2 h-10 w-10 rounded-full border border-stone-600 border-opacity-30 object-fill"
          alt="User Profile"
        />
      ) : (
        <div
          className="mr-2 h-10 w-10 rounded-full border border-stone-600 border-opacity-30 flex items-center justify-center light-search"
          // style={{ backgroundColor }}
        >
          <p className="font-bold">
            {author?.userName?.charAt(0).toUpperCase()}
          </p>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
