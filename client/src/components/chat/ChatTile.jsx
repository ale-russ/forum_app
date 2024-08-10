import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";

import { host } from "../../utils/ApiRoutes";
import { fetchChatMessages } from "../../controllers/ChatController";

const socket = io(host);

const ChatTile = ({ handleToggle, setIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatMessages = async () => {
    try {
      const { data } = await fetchChatMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const message = {
        author: {
          _id: user.userId,
          userName: user.userName,
        },
        content: input,
        createdAt: new Date(),
      };

      socket.emit("chat message", {
        room: "General",
        message,
      });
      setInput("");
    }
  };

  useEffect(() => scrollToBottom, [messages]);

  useEffect(() => {
    handleChatMessages();
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Chats: ", message);
      setTimeout(() => scrollToBottom(), 0);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  return (
    <div
      className={`w-80 h-[600px] light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300 ${
        setIsOpen ? "open-animation" : "close-animation"
      }`}
    >
      <div className="bg-zinc-800 rounded-t-lg p-3 flex items-center justify-between font-bold text-white">
        General Chat
        <div
          className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
          onClick={() => handleToggle(false)}
        >
          X
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
        {messages?.map((msg, index) => {
          const isCurrentUser = msg.author._id === user.userId;
          return (
            <div
              key={index}
              className={`flex flex-col ${
                msg.author._id === user.userId ? "items-end" : "items-start"
              }`}
            >
              {msg.author._id !== user.userId && (
                <p className="text-xs italic mb-1">{msg.author.userName}</p>
              )}
              <div
                className={`rounded-lg shadow-xl border-gray-200 max-w-40 flex ${
                  msg.author._id === user.userId
                    ? "bg-blue-600 text-right"
                    : "bg-zinc-600 text-left"
                }`}
              >
                <span
                  className={`inline-block px-1 py-1 rounded-lg text-[12px] ${
                    msg.author._id === user.userId
                      ? "text-white"
                      : "text-gray-200"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
              <p className="text-[10px] italic">
                {formatDistanceToNow(msg.createdAt)} ago
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center light-search  h-12 pl-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg m-4">
        {/* <EmojiPicker /> */}
        <input
          type="text"
          className="w-full light-search h-full focus:outline-none focus:shadow-outline outline-none border-0 mr-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button className="bg-[#FF571A] text-white p-2 rounded-r-lg h-full">
          <IoMdSend
            className="w-4 h-4 cursor-pointer text-white "
            onClick={handleSendMessage}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatTile;
