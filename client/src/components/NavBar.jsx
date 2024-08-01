import React from "react";
import { MdHomeFilled } from "react-icons/md";
import { BsCalendar4 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AiFillMessage } from "react-icons/ai";
import { TbBellFilled } from "react-icons/tb";
import { TiArrowSortedDown } from "react-icons/ti";

import { ReactComponent as Logo } from "../assets/Logo.svg";
import { ReactComponent as Profile } from "../assets/ProfileImage.svg";

const NavBar = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="flex items-center justify-between px-4 dark-navbar h-16 w-[100%]">
      <div className="flex items-center px-4">
        <Logo />
        <p className="hidden md:flex lg:flex xl:flex px-4 text-[#FF571A] font-bold text-xl">
          KnowledgeChain
        </p>
      </div>
      <IconsTile />
      <div className="flex items-center dark-search rounded-lg px-3 w-[180px] sm:w-[180px] md:w-[300px] xl:w-[600px]">
        <input
          className="hidden sm:block m-auto w-full bg-[#2C353D] border-0 h-10 text-[#858EAD] outline-none"
          placeholder="Type to search here ..."
        />
        <CiSearch className="text-[#858EAD] w-7 h-7" />
      </div>

      <div className="flex items-center">
        <div className="flex items-center mx-8">
          <AiFillMessage className="w-[40px] h-[40px] text-white  px-2 mx-1 md:mx-2 lg:mx-4 xl:mx-4 rounded-lg" />
          <TbBellFilled className="w-[40px] h-[40px] text-white px-2 mx-1 md:mx-2 lg:mx-4 xl:mx-4 rounded-lg" />
        </div>
        <Profile className="mx-2" />
        <p className="hidden sm:hidden md:block lg:block xl:block text-white font-bold text-[16px] text-ellipsis">
          {user.userName}
        </p>
        <TiArrowSortedDown
          className="text-white mx-2 w-4 h-4 "
          onClick={() => console.log("button clicked")}
        />
      </div>
    </div>
  );
};

export default NavBar;

const IconsTile = () => {
  const icons = [MdHomeFilled, BsCalendar4, IoIosPeople];
  return (
    <div className="hidden md:flex lg:flex xl:flex  text-white  items-center">
      {icons.map((Icon, index) => (
        <Icon
          key={index}
          className="w-[40px] h-[40px] text-white px-2 rounded-lg bg-orange-600 m-2"
        />
      ))}
    </div>
  );
};
