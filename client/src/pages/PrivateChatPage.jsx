import React, { useEffect, useState, useRef } from "react";
import { useForum } from "../utils/PostContext";
import { useSocket } from "../utils/SocketContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPrivateMessages } from "../controllers/ChatController";
import { toast } from "react-toastify";

import toastOptions from "../utils/constants";
import { InputComponent } from "../components/common/InputComponent";

const PrivateChatPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recipient } = state || {};
  const { user, token, onlineUsers } = useForum();
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messageEndRef = useRef();

  // console.log("recipient: ", recipient);

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

    if (socket) {
      const handlePrivateMessage = ({ message }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
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
  }, [socket, recipient?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="flex w-full h-[90vh] light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl mt-3">
      <div className="light-search w-[30%] px-2 border-r h-full">
        <p className="font-bold flex justify-center items-center">Contacts</p>
        <div className="flex flex-col items-start relative cursor-pointer mt-4">
          {onlineUsers
            ?.filter((onlineUser) => onlineUser.user._id !== user._id)
            .map((onlineUser) => {
              // const isOnline = onlineUsers?.some(
              //   (onlineUser) => onlineUser.user._id === usr._id
              // );
              // console.log("online user: ", onlineUser);
              return (
                <div
                  className="flex flex-col items-center cursor-pointer"
                  key={onlineUser.user._id}
                  onClick={() => {
                    navigate(`/chat/private-chat/${onlineUser.user._id}`, {
                      state: { recipient: onlineUser.user },
                    });
                    // openChatModal(onlineUser.user);
                  }}
                >
                  <p className="mb-2 rounded-lg light-navbar py-1 px-2 drop-shadow-xl font-bold">
                    {onlineUser.user.userName}
                  </p>
                  {/* {isOnline && (
                      <div className="rounded-full h-2 w-2 bg-green-500 relative -top-4 right-1" />
                    )} */}
                </div>
              );
            })}
        </div>
      </div>
      <div className="w-full flex flex-col justify-between rounded-lg">
        <div className="w-full bg-zinc-800 h-16 rounded-t-lg text-white flex justify-center items-center">
          <h2>{recipient?.userName}</h2>
        </div>
        <div className="w-full p-4 flex flex-col justify-between light-navbar overflow-y-auto space-y-2 scrollbar custom-scrollbar ">
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
          {/* <div ref={messageEndRef} /> */}
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
