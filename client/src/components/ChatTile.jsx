import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { host } from "../utils/ApiRoutes";
import { fetchChatMessages } from "../controllers/ChatController";

const socket = io(host);

const ChatTile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
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
        author: user.userId,
        content: input,
        userName: user.userName,
      };

      const curRoom = currentRoom === "" ? "General" : currentRoom;
      socket.emit("chat message", {
        room: curRoom,
        message,
      });
      setInput("");
    }
  };

  useEffect(() => scrollToBottom, [messages]);

  useEffect(() => {
    handleChatMessages();
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => {
        const messagesArray = Array.isArray(prevMessages) ? prevMessages : [];
        return [...messagesArray, message];
      });
      setTimeout(() => scrollToBottom(), 0);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);
  return (
    <div className="w-80 h-96 light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col ease-in-out duration-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
        {messages?.map((msg, index) => {
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
                className={` rounded-lg shadow-xl border-gray-200 max-w-40 flex
             ${
               msg.author._id === user.userId
                 ? "bg-blue-600 text-right"
                 : "bg-zinc-600 text-left"
             }`}
              >
                <span
                  className={`inline-block px-1 py-1 rounded-lg text-[12px] ${
                    msg.author._id === user.userId
                  } ? "bg-blue-500 text-white" : "bg-gray-200 text-white`}
                >
                  {msg.content}
                </span>
              </div>
              <p className="text-[10px] italic">
                {" "}
                {formatDistanceToNow(msg.createdAt)} ago
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        className="light-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
    </div>
  );
};

export default ChatTile;
