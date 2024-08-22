import React from "react";

import NavBar from "../NavBar";
import LeftSideBar from "../LeftSideBar";

const HomeWrapper = ({ children }) => {
  return <div className="light h-full w-full mt-3">{children}</div>;
};

export default HomeWrapper;
