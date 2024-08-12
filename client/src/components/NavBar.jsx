import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { BsCalendar4 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AiFillMessage } from "react-icons/ai";
import { TbBellFilled } from "react-icons/tb";
import { TiArrowSortedDown } from "react-icons/ti";
import { debounce } from "lodash";

import { ReactComponent as Logo } from "../assets/Logo.svg";
import { ReactComponent as Profile } from "../assets/ProfileImage.svg";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";
import { handleLogout } from "../controllers/AuthController";
import { handleSearch } from "../controllers/ForumController";
import { useForum } from "../utils/PostContext";

const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const { setUserAuth } = useContext(UserAuthContext);
  const { token } = useForum();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const signOut = async () => {
    await handleLogout({ navigate });
    setUserAuth({ newToken: "" });
    navigate("/");
  };

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

  // const debouncedSearch = useCallback(
  //   debounce((query) => {
  //     // handleSearch(query);
  //     getSearchResults();
  //   }, 300),
  //   []
  // );

  // useEffect(() => {
  //   if (searchQuery) {
  //     debouncedSearch(searchQuery);
  //   } else {
  //     setSearchResult([]);
  //   }
  // }, [searchQuery, debouncedSearch]);

  // useEffect(() => {
  //   if (searchResult.length === 0) {
  //     setShowSearchModal(false);
  //   } else {
  //     setShowSearchModal(true);
  //   }
  // }, [searchResult, showSearchModal]);

  // console.log("ShowSearchModal: ", showSearchModal);

  return (
    <div className="flex items-center justify-between px-1 md:px-4 light-navbar h-16 w-[100%] shadow-lg">
      <div className="flex items-center px-1 md:px-4">
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

const DisplaySearchResults = ({ setShowSearchModal, searchResults }) => {
  const navigate = useNavigate();
  return (
    <div className="light absolute inset-x-0 top-12 mt-2 mx-auto w-[80vw] md:w-full z-50 border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300">
      <div className="flex items-center justify-end p-2 w-full">
        <div
          className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
          onClick={() => setShowSearchModal(false)}
        >
          X
        </div>
      </div>
      <div className="light overflow-y-auto scrollbar custom-scrollbar max-h-60">
        {searchResults?.map((post) => (
          <div
            key={post._id}
            className="line-clamp-2 font-bold p-3 rounded-lg shadow-lg border border-gray-300 border-opacity-30 my-3 mx-2 light-navbar"
            onClick={() => navigate(`/post/${post._id}`, { state: { post } })}
          >
            {post?.title} : {post?.content}
          </div>
        ))}
      </div>
    </div>
  );
};
