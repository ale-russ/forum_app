import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import { host } from "../../utils/ApiRoutes";
import { InputComponent } from "../common/InputComponent";
import { useForum } from "../../utils/PostContext";

const socket = io(host);

const PrivateChat = ({ recipient, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const { user } = useForum();

  useEffect(() => {
    socket.on("private message", ({ message, senderId }) => {
      console.log("Received message:", message, senderId);
      console.log("Sender ID:", senderId);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("error", (errorMessage) => {
      console.error("Socket error:", errorMessage);
    });

    return () => {
      socket.off("private message");
      socket.off("error");
    };
  }, []);

  const sendPrivateMessage = () => {
    if (input.trim()) {
      const message = {
        content: input,
        from: user._id,
        to: recipient._id,
        timestamp: new Date(),
      };
      console.log("Sending Private message:", message);
      socket.emit("private message", { message });
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
      setShowPicker(false);
    }
  };

  return (
    <div className="w-80 h-[600px] light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300">
      <div className="bg-zinc-800 rounded-t-lg p-3 flex items-center justify-between font-bold text-white w-full">
        <h2>{recipient.userName}</h2>
        <div
          className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
          onClick={() => onClose()}
        >
          X
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
        {messages.map((msg, index) => {
          //   console.log("MESSAGE: ", msg);
          return (
            <div
              key={index}
              className={msg.from === user._id ? "sent" : "received"}
            >
              {msg.content}
            </div>
          );
        })}
      </div>
      <InputComponent
        input={input}
        setInput={setInput}
        handleSendMessage={sendPrivateMessage}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
      />
    </div>
  );
};

export default PrivateChat;
