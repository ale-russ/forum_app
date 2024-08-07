import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { host } from "../utils/ApiRoutes";
import { fetchChatMessages } from "../controllers/ChatController";

const socket = io(host);

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => scrollToBottom, [messages]);

  useEffect(() => {
    handleChatMessages();
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleChatMessages = async () => {
    const { data } = await fetchChatMessages();
    setMessages(data);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const message = {
        author: user.userId,
        content: input,
        userName: user.userName,
      };
      socket.emit("chat message", message);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center">
      <button
        className="bg-[#FF571A] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#e99475] transition-colors z-50"
        onClick={handleToggle}
      >
        Chat
      </button>
      <div className="fixed bottom-16 right-10 z-50">
        {isOpen && (
          <div className="w-80 h-96 dark border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
              {messages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.author._id === user.userId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    {msg.author._id !== user.userId && (
                      <p className="text-xs italic mb-1">
                        {msg.author.userName}
                      </p>
                    )}
                    <div
                      className={` rounded-lg shadow-xl border-gray-200 max-w-40 flex
                     ${
                       msg.author._id === user.userId
                         ? "bg-blue-600 text-right"
                         : "bg-stone-700 text-left"
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
              className="dark-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
