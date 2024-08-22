import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { BsCalendar4 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AiFillMessage } from "react-icons/ai";
import { TbBellFilled } from "react-icons/tb";
import { TiArrowSortedDown } from "react-icons/ti";

import { ReactComponent as Logo } from "../assets/Logo.svg";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";
import { handleLogout } from "../controllers/AuthController";
import { handleSearch } from "../controllers/ForumController";
import { useForum } from "../utils/PostContext";
import ProfileImage from "./common/ProfileImage";

const NavBar = () => {
  const { token, user, messageNotification } = useForum();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const getSearchResults = async () => {
    const searchRes = await handleSearch(searchQuery, token);
    setSearchResult(searchRes);
    if (searchResult === 0) {
      setShowSearchModal(false);
    } else {
      setShowSearchModal(true);
    }
    console.log("Search Results: ", searchResult);
    setSearchQuery("");
  };

  return (
    <div className="flex items-center justify-between px-1 md:px-4 light-navbar h-16 w-full shadow-lg sticky top-0 right-0 left-0 z-50">
      <div
        className="flex items-center px-1 md:px-4 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <Logo />
        <p className="hidden md:flex lg:flex xl:flex px-4 text-[#FF571A] font-bold text-xl">
          KnowledgeChain
        </p>
      </div>
      {/* <IconsTile /> */}
      <div className="flex flex-col relative w-full md:w-[300px] xl:w-[600px]">
        <div className="flex items-center light-search rounded-lg px-3 w-full ">
          <input
            className="sm:block m-auto w-full light-search border-0 h-10 text-[#858EAD] outline-none"
            placeholder="Type to search here ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              e.preventDefault;
              if (e.key === "Enter") {
                getSearchResults();
              }
            }}
          />
          <CiSearch className="text-[#858EAD] w-7 h-7" />
        </div>
        {showSearchModal ? (
          <DisplaySearchResults
            setShowSearchModal={setShowSearchModal}
            searchResults={searchResult}
          />
        ) : null}
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

        <ProfileImage author={user} />

        <p className="font-bold text-[16px] text-ellipsis">{user.userName}</p>
        <TiArrowSortedDown
          className="relative mx-2 w-4 h-4 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown ? <UserMenus /> : null}
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

const DisplaySearchResults = ({ setShowSearchModal, searchResults }) => {
  const navigate = useNavigate();
  return (
    <div className="light absolute inset-x-0 top-12 mt-2 mx-auto w-[80vw] md:w-full min-h-40 z-50 border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300">
      <div className="flex items-center justify-end p-2 w-full">
        <div
          className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
          onClick={() => setShowSearchModal(false)}
        >
          X
        </div>
      </div>
      <div className="light overflow-y-auto scrollbar custom-scrollbar max-h-60">
        {searchResults.length > 0 ? (
          searchResults?.map((post) => (
            <div
              key={post._id}
              className="font-bold p-3 rounded-lg shadow-lg border border-gray-300 border-opacity-30 my-3 mx-2 light-navbar overflow-x-hidden cursor-pointer truncate text-clip whitespace-nowrap"
              onClick={() => navigate(`/post/${post._id}`, { state: { post } })}
            >
              {post?.title} : {post?.content}
            </div>
          ))
        ) : (
          <div className="h-40 w-full flex items-center justify-center">
            Nothing Found
          </div>
        )}
      </div>
    </div>
  );
};

const UserMenus = () => {
  const { user } = useForum();
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserAuthContext);

  const signOut = async () => {
    await handleLogout({ navigate });
    setUserAuth({ newToken: "" });
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center justify-start fixed right-4 top-16 z-50 h-40 w-36 light-navbar rounded shadow-xl border border-gray-300">
      <div className="p-2">
        <strong>{user.userName}</strong>
      </div>
      <div className="w-full border border-gray-300 m-3" />
      <div className="flex flex-col items-start justify-center w-full gap-y-2 p-2">
        <p
          className="border border-gray-300 rounded-sm drop-shadow-xl light-search opacity-65 w-full p-1 cursor-pointer "
          onClick={() => navigate("/user-profile")}
        >
          Profile
        </p>
        <button
          className="bg-red-600 text-white rounded-lg px-1 text-sm"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
