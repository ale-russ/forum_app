import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { BsCalendar4 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AiFillMessage } from "react-icons/ai";
import { TbBellFilled } from "react-icons/tb";
import { TiArrowSortedDown } from "react-icons/ti";

import { ReactComponent as Logo } from "../assets/Logo.svg";
import { ReactComponent as Profile } from "../assets/ProfileImage.svg";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";
import { handleLogout } from "../controllers/AuthController";

const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const { setUserAuth } = useContext(UserAuthContext);

  const signOut = async () => {
    await handleLogout({ navigate });
    setUserAuth({ newToken: "" });
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-4 light-navbar h-16 w-[100%] shadow-lg">
      <div className="flex items-center px-4">
        <Logo />
        <p className="hidden md:flex lg:flex xl:flex px-4 text-[#FF571A] font-bold text-xl">
          KnowledgeChain
        </p>
      </div>
      {/* <IconsTile /> */}
      <div className="flex items-center light-search rounded-lg px-3 w-[250px] md:w-[300px] xl:w-[600px]">
        <input
          className="sm:block m-auto w-full light-search border-0 h-10 text-[#858EAD] outline-none"
          placeholder="Type to search here ..."
        />
        <CiSearch className="text-[#858EAD] w-7 h-7" />
      </div>

      <div className="flex items-center">
        <div className="flex items-center mx-2 text-gray-700">
          <div className="flex items-center mx-1 rounded-lg light-search">
            <AiFillMessage className="w-9 h-9  px-2  rounded-lg" />
          </div>
          <div className="flex items-center mx-auto rounded-lg light-search">
            <TbBellFilled className="w-9 h-9  px-2  rounded-lg" />
          </div>
        </div>
        <Profile className="mr-2" onClick={signOut} />
        <p className="hidden sm:hidden md:block lg:block xl:block  font-bold text-[16px] text-ellipsis">
          {user.userName}
        </p>
        <TiArrowSortedDown
          className="mx-2 w-4 h-4 "
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
