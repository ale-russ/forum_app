import React from "react";
import { MdHomeFilled } from "react-icons/md";
import { BsCalendar4 } from "react-icons/bs";

import { ReactComponent as Logo } from "../assets/Logo.svg";

const NavBar = () => {
  return (
    <div className="flex items-center px-4 bg-[#262D34] h-16">
      <div className="flex items-center px-4">
        <Logo />
        <p className="px-4 text-[#FF571A] font-bold text-xl">Let's Talk</p>
      </div>
      <div>
        <MdHomeFilled className="w-[40px] h-[40px] text-white" />
        <BsCalendar4 />
      </div>
    </div>
  );
};

export default NavBar;
