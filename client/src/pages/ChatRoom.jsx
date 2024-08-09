import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import { host } from "../utils/ApiRoutes";
import { useParams } from "react-router-dom";

const socket = io(host);

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("user join", (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("user left", (user) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.name !== user));
    });

    return () => {
      socket.off("message");
      socket.off("user join");
      socket.off("user left");
    };
  }, []);

  const handleSendMessage = () => {
    if (input) {
      console.log("in send");
      socket.emit("sendMessage", {
        content: input,
        author: user.userId,
        room: roomId,
      });
      setInput("");
    }
  };

  useEffect(() => {
    socket.emit("joinRoom", { room: roomId });
    return () => socket.emit("leaveRoom", { room: roomId });
  }, [roomId]);
  return (
    <div className="flex h-full w-full">
      <div className="light-navbar w-full md:w-[30%] p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="mb-2">
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-[70%] p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <strong>{message.author.username}:</strong> {message.content}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            className="bg-[#FF571A] text-white p-2 rounded-r-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
