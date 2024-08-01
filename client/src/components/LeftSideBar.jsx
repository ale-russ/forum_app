import React from "react";
import LargeBaches from "./LargeBaches";
import PopularTags from "./PopularTags";
import PinnedGroups from "./PinnedGroups";

const RightSideBar = () => {
  return (
    <div className=" hidden md:flex lg:flex xl:flex flex-col">
      <LargeBaches />
      <PopularTags />
      <PinnedGroups />
    </div>
  );
};

export default RightSideBar;
