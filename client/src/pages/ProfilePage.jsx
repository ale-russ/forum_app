import React from "react";

import { useForum } from "../utils/PostContext";
import ProfileImage from "../components/common/ProfileImage";

const ProfilePage = () => {
  const { user } = useForum();

  return (
    <div className="m-auto h-full w-full lg:w-[40%] light-navbar p-4  flex-col space-y-4 rounded-lg shadow-xl">
      <div className="rounded-lg shadow-xl w-full h-36 flex flex-col items-center justify-center light-search ">
        <div className="flex flex-col items-center justify-center hover:scale-105 transition duration-300 ease-in-out">
          <ProfileImage author={user} />
          <p className="font-bold ">{user.userName}</p>
        </div>
      </div>
      <div className="rounded-lg shadow-xl w-full flex flex-col items-center justify-between light-search p-3 my-2 space-y-4">
        <UserDetails title="Email" label={user?.email} />
        <UserDetails title="Posts" label={user?.postsCount ?? 0} />
        <UserDetails
          title="Liked Posts"
          label={user?.likedPosts?.length ?? 0}
        />
        <UserDetails
          title="Rooms Joined"
          label={user?.roomsJoined?.length ?? 0}
        />
        <UserDetails
          title="Created Rooms"
          label={user?.roomsCreated?.length ?? 0}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

const UserDetails = ({ title, label }) => {
  return (
    <div className="flex items-center justify-between w-full px-2 rounded-lg shadow-xl light-navbar h-10">
      <div>{title}</div>
      <div>{label}</div>
    </div>
  );
};
