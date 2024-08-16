import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

import { host } from "../../utils/ApiRoutes";
import { fetchChatMessages } from "../../controllers/ChatController";
import { InputComponent } from "../common/InputComponent";
import { useForum } from "../../utils/PostContext";

const socket = io(host);

const ChatTile = ({ handleToggle, setIsOpen, openChatModal }) => {
  const messagesEndRef = useRef(null);
  const { user, onlineUsers } = useForum();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);

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
    console.log("In handleSendMessage");
    if (input.trim()) {
      const message = {
        author: {
          _id: user._id,
          userName: user.userName,
        },
        content: input,
        createdAt: new Date(),
      };

      console.log("Message sent: ", message);

      socket.emit("chat message", {
        room: "General",
        message,
      });
      setInput("");
      setShowPicker(false);
    }
  };

  useEffect(() => scrollToBottom, [messages]);

  useEffect(() => {
    handleChatMessages();
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
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
      <div className="bg-zinc-800 rounded-t-lg p-3 flex flex-col items-center justify-between font-bold text-white w-full">
        <div className="bg-zinc-800 rounded-t-lg p-3 flex items-center justify-between font-bold text-white w-full">
          General Chat
          <div
            className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
            onClick={() => handleToggle(false)}
          >
            X
          </div>
        </div>
        Online Users
        <div className="flex items-center justify-start space-x-2 w-full overflow-x-auto scrollbar custom-scrollbar">
          {onlineUsers?.map((user) => {
            return (
              <div
                className="bg-green-600"
                key={user.user._id}
                onClick={() => {
                  console.log("button clicked");
                  openChatModal(user.user);
                }}
              >
                {user.user.userName}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
        {messages?.map((msg, index) => {
          const isCurrentUser = msg.author._id === user._id;
          return (
            <div
              key={index}
              className={`flex flex-col ${
                msg.author._id === user._id ? "items-end" : "items-start"
              }`}
            >
              {msg.author._id !== user._id && (
                <p className="text-xs italic mb-1">{msg.author.userName}</p>
              )}
              <div
                className={`rounded-lg shadow-xl border-gray-200 min-w-10 max-w-40 flex ${
                  msg.author._id === user._id
                    ? "bg-blue-600 text-right"
                    : "bg-zinc-600 text-left"
                }`}
              >
                <span
                  className={`inline-block px-1 py-1 rounded-lg text-[12px] ${
                    msg.author._id === user._id ? "text-white" : "text-gray-200"
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
      <InputComponent
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        input={input}
      />
      {open}
    </div>
  );
};

export default ChatTile;
