import React, { useState, useEffect, useRef } from "react";

import { InputComponent } from "../common/InputComponent";
import { useForum } from "../../utils/PostContext";
import { useSocket } from "../../utils/SocketContext";
import { fetchPrivateMessages } from "../../controllers/ChatController";
import { toast } from "react-toastify";
import toastOptions from "../../utils/constants";

const PrivateChat = ({ recipient, onClose }) => {
  const { user, token } = useForum();
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messageEndRef = useRef();

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatMessages = async () => {
    try {
      const { data } = await fetchPrivateMessages(
        user._id,
        recipient._id,
        token
      );
      setMessages(data);
    } catch (error) {
      toast.error("Error fetching messages", toastOptions);
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
        socket.off("private message", handlePrivateMessage);
        socket.off("error", handleError);
      };
    }
  }, [socket, recipient._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendPrivateMessage = () => {
    if (input.trim() && socket) {
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
    <div className="`w-66 h-[500px] light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300">
      <div className="bg-zinc-800 rounded-t-lg p-3 flex items-center justify-between font-bold text-white w-full">
        <h2>{recipient.userName}</h2>
        <div
          className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
          onClick={() => onClose()}
        >
          X
        </div>
      </div>
      <div className="flex-1 overflow-y-hidden p-4 space-y-2  w-full">
        {messages.map((msg) => {
          const isCurrentUser = msg.author === user._id;
          const key = `${msg.timestamp}-${Math.random()}`;

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
                  {msg.content}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
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
  );
};

export default PrivateChat;
