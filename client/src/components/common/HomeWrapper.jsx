import React from "react";

import NavBar from "../NavBar";
import LeftSideBar from "../LeftSideBar";

const HomeWrapper = ({ children }) => {
  return (
    <div className="light h-full w-full">
      <NavBar />
      <div className="flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row px-4 h-full w-full">
        <LeftSideBar />
        {children}
      </div>
    </div>
  );
};

export default HomeWrapper;
