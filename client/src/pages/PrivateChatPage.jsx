import React, { useEffect, useState, useRef } from "react";
import { useForum } from "../utils/PostContext";
import { useSocket } from "../utils/SocketContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPrivateMessages } from "../controllers/ChatController";
import { toast } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";

import { sendMessage, toastOptions } from "../utils/constants";
import { InputComponent } from "../components/common/InputComponent";
import ProfileImage from "../components/common/ProfileImage";
import { validDate } from "../utils/FormatDate";
import { useMessage } from "../utils/MessageContextProvider";

const PrivateChatPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recipient } = state || {};
  const { user, token, onlineUsers, dimensions, handleFetchUsers, userList } =
    useForum();

  const smallScreen = dimensions.width < 768;
  const socket = useSocket();
  const { messages, setMessages } = useMessage();

  const [userTyping, setUserTyping] = useState("");
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const [listHeight, setListHeight] = useState(500);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setListHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    if (listRef?.current) {
      listRef?.current?.resetAfterIndex(0);
    }

    if (messageRef?.current) {
      const { height } = messageRef?.current?.getBoundingClientRect();
      setMessageHeight(height);
    }

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleChatMessages = async () => {
    try {
      const { data } = await fetchPrivateMessages(
        user?._id,
        recipient?._id,
        token
      );
      setMessages(data);
    } catch (error) {
      toast.error("Error Fetching Messages", toastOptions);
      setMessages([]);
    }
  };

  useEffect(() => {
    handleChatMessages();
    handleFetchUsers();
  }, [socket, recipient?._id]);

  const sendPrivateMessage = () => {
    if (input.trim()) {
      sendMessage({
        input,
        user,
        recipient,
        socket,
        socketEvent: "private message",
        setMessage: setMessages,
        setInput,
      });

      setShowPicker(false);
    }
  };

  // const getItemsSize = (index) => estimatedMessageHeight(messages[index]);

  return (
    <div className="flex w-full h-[90vh] light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl mt-3">
      <div className="hidden md:flex flex-col light-search w-[30%] px-2 border-r h-full">
        <p className="font-bold flex justify-center items-center">Contacts</p>
        <div className="flex flex-col items-start relative cursor-pointer mt-4">
          {userList
            ?.filter(
              (usr) => usr?._id !== user?._id && usr?._id !== recipient?._id
            )
            .sort((a, b) => a.userName.localeCompare(b.userName))
            .map((usr) => {
              const isOnline = onlineUsers?.some(
                (onlineUser) => onlineUser.user._id === usr._id
              );
              return (
                <div
                  className="relative flex flex-col items-start justify-start cursor-pointer w-full"
                  key={usr._id}
                  onClick={() => {
                    navigate(`/chat/private-chat/${usr._id}`, {
                      state: { recipient: usr },
                    });
                  }}
                >
                  <p className="mb-2 rounded-lg light-navbar py-1 px-2 drop-shadow-xl font-bold w-full">
                    {usr.userName}
                  </p>

                  {isOnline && (
                    <div className="rounded-full border border-stone-300 h-3 w-3 bg-green-500 absolute -top-1 right-0" />
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <div className="w-full flex flex-col justify-between rounded-lg">
        <div className="w-full bg-zinc-800 h-28 rounded-t-lg text-white flex flex-col justify-center items-center py-4">
          <h2>{recipient?.userName}</h2>
          {smallScreen && (
            <div className="flex items-center justify-start px-2 w-full ">
              {userList
                ?.filter(
                  (usr) => usr?._id !== user?._id && usr?._id !== recipient?._id
                )
                .sort((a, b) => a.userName.localeCompare(b.userName))
                .map((usr) => {
                  const isOnline = onlineUsers?.some(
                    (onlineUser) => onlineUser.user?._id === usr?._id
                  );
                  return (
                    <div
                      className="relative flex items-center mx-2 cursor-pointer"
                      key={usr._id}
                      aria-label={`Chat with ${usr.userName}`}
                      onClick={() => {
                        navigate(`/chat/private-chat/${usr?._id}`, {
                          state: { recipient: usr },
                        });
                      }}
                    >
                      <div className="flex flex-col items-center ">
                        <ProfileImage author={usr} />
                        {usr.userName}
                      </div>

                      {isOnline && (
                        <div className="rounded-full border border-stone-300 h-3 w-3 bg-green-500 absolute top-1 left-8" />
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <div className="w-full h-full p-4 flex flex-col items-start light-navbar overflow-x-hidden overflow-y-auto space-y-2 scrollbar custom-scrollbar ">
          <ScrollableFeed className="w-full overflow-x-hidden">
            {messages?.map((msg) => {
              const isCurrentUser = msg?.author === user?._id;
              const key = `${msg?.timestamp}-${Math.random()}`;

              return (
                <div
                  key={key}
                  className={`w-full flex flex-col ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg shadow-xl border-gray-200 min-w-10 max-w-40 flex ${
                      isCurrentUser
                        ? "bg-blue-600 text-right"
                        : "bg-zinc-600 text-left "
                    }`}
                  >
                    <span className="inline-block px-1 py-1 rounded-lg text-[12px] text-white">
                      {msg?.content}
                    </span>
                  </div>

                  <p className="text-[10px] italic">
                    {validDate(msg?.createdAt)}
                  </p>
                </div>
              );
            })}
          </ScrollableFeed>
          {/* {userTyping && (
            <div className="w-40 flex justify-between items-center italic text-gray-500">
              {userTyping}{" "}
              <div className="h-3 w-3 rounded-full animate-bounce [animation-delay:0.3s] bg-gray-400"></div>
              <div className="h-3 w-3 rounded-full animate-bounce [animation-delay:0.15s] bg-gray-400"></div>
              <div className="h-3 w-3 rounded-full animate-bounce bg-gray-400"></div>
            </div>
          )} */}
        </div>

        <InputComponent
          input={input}
          setInput={setInput}
          handleSendMessage={sendPrivateMessage}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          socket={socket}
          setUserTyping={setUserTyping}
          recipient={recipient}
          userTyping={userTyping}
        />
      </div>
    </div>
  );
};

export default PrivateChatPage;
