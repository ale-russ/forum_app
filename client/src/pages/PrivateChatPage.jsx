import React, { useEffect, useState, useRef } from "react";
import { useForum } from "../utils/PostContext";
import { useSocket } from "../utils/SocketContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPrivateMessages } from "../controllers/ChatController";
import { toast } from "react-toastify";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import toastOptions from "../utils/constants";
import { InputComponent } from "../components/common/InputComponent";
import ProfileImage from "../components/common/ProfileImage";
import { estimatedMessageHeight } from "../utils/MessageHeight";
import { messageContainer } from "../components/chat/MessageContainer";

const PrivateChatPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recipient } = state || {};
  const {
    user,
    token,
    onlineUsers,
    messageNotification,
    setMessageNotification,
    dimensions,
    handleFetchUsers,
    userList,
  } = useForum();

  const smallScreen = dimensions.width < 768;
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messageEndRef = useRef();

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

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (listRef?.current) {
      listRef?.current?.resetAfterIndex(0);
    }
  }, []);

  useEffect(() => {
    if (messageRef?.current) {
      const { height } = messageRef?.current?.getBoundingClientRect();
      setMessageHeight(height);
    }
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatMessages = async () => {
    try {
      const { data } = await fetchPrivateMessages(
        user?._id,
        recipient?._id,
        token
      );
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast.error("Error Fetching Messages", toastOptions);
      setMessages([]);
    }
  };

  useEffect(() => {
    handleChatMessages();
    handleFetchUsers();

    if (socket) {
      const handlePrivateMessage = (message) => {
        console.log("private message: ", message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setMessageNotification({ message });
      };

      const handleError = (errorMessage) => {
        console.error("Socket error:", errorMessage);
      };

      socket.on("private message", handlePrivateMessage);
      socket.on("error", handleError);

      return () => {
        socket.off("private message");
        socket.off("error");
      };
    }
  }, [socket, recipient?._id, setMessageNotification]);

  // useEffect(() => {
  //   console.log("new notification: ", messageNotification);
  // }, [messageNotification]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const sendPrivateMessage = () => {
    if (input.trim()) {
      const message = {
        content: input,
        author: user._id,
        recipient: recipient._id,
        userName: user.userName,
        profileImage: user.profileImage,
        timestamp: new Date().toISOString(),
      };

      socket.emit("private message", { message, recipient });
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
      setShowPicker(false);
    }
  };

  const getItemsSize = (index) => estimatedMessageHeight(messages[index]);

  return (
    <div className="flex w-full h-[90vh] light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl mt-3">
      <div className="hidden md:flex flex-col light-search w-[30%] px-2 border-r h-full">
        <p className="font-bold flex justify-center items-center">Contacts</p>
        <div className="flex flex-col items-start relative cursor-pointer mt-4">
          {userList
            ?.filter((usr) => usr._id !== user._id && usr._id !== recipient._id)
            .map((usr) => {
              const isOnline = onlineUsers?.some(
                (onlineUser) => onlineUser.user._id === usr._id
              );
              return (
                <div
                  className="flex flex-col items-start justify-start cursor-pointer w-full"
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
                  (usr) => usr._id !== user._id && usr._id !== recipient._id
                )
                .map((usr) => {
                  const isOnline = onlineUsers?.some(
                    (onlineUser) => onlineUser.user._id === usr._id
                  );
                  return (
                    <div
                      className="flex items-center mx-2 cursor-pointer"
                      key={usr._id}
                      onClick={() => {
                        navigate(`/chat/private-chat/${usr._id}`, {
                          state: { recipient: usr },
                        });
                      }}
                    >
                      <div className="flex flex-col items-center ">
                        <ProfileImage author={usr} />
                        {usr.userName}
                      </div>

                      {isOnline && (
                        <div className="rounded-full h-3 w-3 bg-green-500 relative -top-[24px] right-5 md:right-1" />
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        {/* <div className="w-full h-full p-4 flex flex-col items-start light-navbar overflow-y-auto space-y-2 scrollbar custom-scrollbar ">
          {messages?.map((msg) => {
            const isCurrentUser = msg?.author === user?._id;
            const key = `${msg?.timestamp}-${Math.random()}`;

            return (
              <div
                key={key}
                className={`w-full flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
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
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div> */}
        <div ref={containerRef} className="flex-grow overflow-hidden">
          <AutoSizer>
            {({ width }) => (
              <List
                ref={listRef}
                itemCount={messages.length}
                height={listHeight}
                itemSize={getItemsSize}
                width={width}
                className="scrollbar custom-scrollbar"
              >
                {messageContainer(messages, user)}
              </List>
            )}
          </AutoSizer>
        </div>
        <InputComponent
          input={input}
          setInput={setInput}
          handleSendMessage={sendPrivateMessage}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default PrivateChatPage;
