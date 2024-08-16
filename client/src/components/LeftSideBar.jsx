import React from "react";
import LargeBaches from "./LargeBaches";
import PopularRooms from "./chat/PopularRooms";
import PinnedGroups from "./PinnedGroups";

const RightSideBar = () => {
  return (
    <div className=" hidden md:flex lg:flex xl:flex flex-col">
      <LargeBaches />
      <PopularRooms />
      <PinnedGroups />
    </div>
  );
};

export default RightSideBar;
