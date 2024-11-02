import React, { useEffect, useRef, useState } from "react";
import { MdHomeFilled } from "react-icons/md";
import { BsCalendar4 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";

import { useForum } from "../utils/PostContext";
import ProfileImage from "./common/ProfileImage";
import UserMenus from "./common/UserMenus";
import { useMessage } from "../utils/MessageContextProvider.jsx";
import HeaderLogo from "./common/HeaderLogo.jsx";
import Search from "./common/Search.jsx";
import Notification from "./common/Notification.jsx";
import Contacts from "./common/Contacts.jsx";

const NavBar = () => {
  const { user } = useForum();
  const { newMessages } = useMessage();

  const [showDropdown, setShowDropdown] = useState(false);
  const userMenuRef = useRef();

  let isInChatPage =
    newMessages.length > 0 &&
    newMessages.some((msg) => msg.author === user?._id);

  const handleCloseDropdownMenu = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuRef?.current &&
        !userMenuRef?.current?.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-1 md:px-4 light-navbar h-16 w-full shadow-lg fixed top-0 right-0 left-0 z-50">
      <HeaderLogo />

      {/* <IconsTile /> */}
      <Search />
      <div className="flex items-center">
        <div className="flex items-center mx-2 text-gray-700">
          <Contacts />
          <Notification />
        </div>

        <div className="hidden md:flex">
          <ProfileImage author={user} />
        </div>

        <p className="font-bold text-[16px] text-ellipsis">{user?.userName}</p>
        <TiArrowSortedDown
          className="relative mx-2 w-4 h-4 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {showDropdown ? (
          <UserMenus
            userMenuRef={userMenuRef}
            showDropdown={showDropdown}
            handleCloseDropdownMenu={handleCloseDropdownMenu}
          />
        ) : null}
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
