import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { BsCalendar4 } from "react-icons/bs";
import { IoIosPeople, IoMdContacts } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AiFillMessage } from "react-icons/ai";
import { TbBellFilled } from "react-icons/tb";
import { TiArrowSortedDown } from "react-icons/ti";

import { ReactComponent as Logo } from "../assets/Logo.svg";
import { handleSearch } from "../controllers/ForumController";
import { useForum } from "../utils/PostContext";
import ProfileImage from "./common/ProfileImage";
import UserMenus from "./common/UserMenus";
import DisplayContactsModal from "./common/DisplayContactsModal";
import useCloseModal from "../hooks/useCloseModal.js";
import { useMessage } from "../utils/MessageContextProvider.jsx";

const NavBar = () => {
  const { token, user } = useForum();
  const {
    newMessages,
    hasUnreadMessages,
    setHasUnreadMessages,
    navigateToChat,
    setNotifications,
  } = useMessage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef();
  const contactsModalRef = useRef();
  const [showContacts, setShowContacts] = useState(false);
  const [showNotification, setShoNotification] = useState(false);

  useCloseModal(contactsModalRef, () => setShowContacts(false));

  let isInChatPage =
    newMessages.length > 0 &&
    newMessages.some((msg) => msg.author === user._id);

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

    function handleOutsideClick(event) {
      if (
        contactsModalRef?.current &&
        !contactsModalRef?.current?.contains(event.target)
      ) {
        setShowContacts(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
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
          <div
            className="flex items-center mx-1 rounded-lg light-search cursor-pointer"
            onClick={() => setShowContacts(!showContacts)}
          >
            <IoMdContacts className="w-9 h-9  px-2  rounded-lg" />
          </div>
          <div
            className=" relative  flex items-center mx-auto rounded-lg light-search cursor-pointer"
            onClick={() => {
              setShoNotification(!showNotification);
            }}
          >
            <TbBellFilled className="w-9 h-9  px-2  rounded-lg" />
            {hasUnreadMessages && (
              <div className="absolute top-2 right-2 rounded-full h-2 w-2 bg-red-600" />
            )}
          </div>
        </div>

        <div className="hidden md:flex">
          <ProfileImage author={user} />
        </div>

        <p className="font-bold text-[16px] text-ellipsis">{user.userName}</p>
        <TiArrowSortedDown
          className="relative mx-2 w-4 h-4 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showNotification ? (
          <div
            className={`flex flex-col items-center justify-start fixed right-4 top-16 z-40 w-72 min-h-16 max-h-72 light-navbar rounded shadow-xl border border-gray-300 overflow-x-hidden overflow-y-auto scrollbar custom-scrollbar ${
              showNotification
                ? "opacity-100 animate-slide-in-down"
                : "opacity-0 animate-slide-out-up pointer-events-none"
            }`}
          >
            {newMessages.length > 0 ? (
              newMessages?.map((message, index) => {
                setHasUnreadMessages(false);
                return (
                  <div
                    onClick={() => {
                      if (!message?.isPost) {
                        navigateToChat(message?.author);
                      } else {
                        navigate(`/post/:${message?.message?._id}`, {
                          state: { post: message?.message },
                        });
                        setNotifications({});
                      }
                    }}
                    key={index}
                    className="flex items-center rounded-lg shadow-lg border-gray-300 my-2  w-[95%] px-2 h-8 light-search text-ellipsis truncate text-sm"
                  >
                    <p className="italic">
                      {message?.userName
                        ? message?.userName
                        : message?.author?.userName}{" "}
                      :
                    </p>

                    <p className="mx-2 text-ellipsis">
                      {message?.userName ? (
                        <p>has sent you a message</p>
                      ) : (
                        <p>has posted a new post</p>
                      )}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="italic h-6 w-full m-auto text-center">
                No new notifications
              </div>
            )}
          </div>
        ) : null}
        {showContacts ? (
          <DisplayContactsModal
            contactsModalRef={contactsModalRef}
            showContacts={showContacts}
          />
        ) : null}
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
