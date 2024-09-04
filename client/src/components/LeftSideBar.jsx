import React from "react";
import LargeBatches from "./LargeBaches";
import PopularRooms from "./chat/PopularRooms";
import PinnedGroups from "./PinnedGroups";

const RightSideBar = () => {
  return (
    <div className=" hidden  lg:flex xl:flex flex-col">
      <LargeBatches />
      <PopularRooms />
      {/* <PinnedGroups /> */}
    </div>
  );
};

export default RightSideBar;
