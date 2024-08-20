import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import { host } from "../utils/ApiRoutes";
import Chat from "../components/chat/Chat";
import { useForum } from "../utils/PostContext";
import HomeWrapper from "../components/common/HomeWrapper";
import { InputComponent } from "../components/common/InputComponent";

const socket = io(host);

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(roomId);
  const [chatRoom, setChatRoom] = useState();
  const { chatRooms, user, handleFetchRooms, onlineUsers } = useForum();
  const messagesEndRef = useRef(null);

  const [showPicker, setShowPicker] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom, [messages]);

  useEffect(() => {
    if (roomId) {
      socket.emit("join room", roomId);
    }

    return () => {
      if (roomId) {
        socket.emit("leave room", roomId);
      }
    };
  }, [roomId]);

  useEffect(() => {
    socket.on("chat room message", (message) => {
      setMessages((prevMessages) => {
        if (message.room === currentRoom) {
          return [...prevMessages, message];
        }
      });
      setTimeout(() => scrollToBottom(), 0);
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

  useEffect(() => {
    const findAndSetRoom = () => {
      const matchedRoom = chatRooms?.find((room) => room._id === roomId);
      if (matchedRoom) {
        setChatRoom(matchedRoom);
        setMessages([...matchedRoom?.messages]);
      } else {
      }
    };

    if (chatRooms?.length === 0) {
      handleFetchRooms().then((fetchedRooms) => {
        const matchedRoom = fetchedRooms?.find((room) => room._id === roomId);
        setChatRoom(matchedRoom || null);
      });
    } else {
      findAndSetRoom();
    }
  }, [roomId, chatRooms, handleFetchRooms]);

  const handleSendMessage = () => {
    if (input) {
      const message = {
        content: input,
        author: user._id,
        userName: user.userName,
      };
      socket.emit("chat room message", {
        room: roomId,
        message,
      });
      setInput("");
      setShowPicker(false);
    }
  };

  return (
    <HomeWrapper
      children={
        <div className="flex h-[80%] w-full lg:w-[60%] xl:w-[60%] shadow-xl border rounded-lg m-auto mt-3">
          <div className="light-search w-full md:w-[30%] py-4 px-2 border-r">
            <h2 className="text-lg font-bold mb-4">Users</h2>
            <ul>
              {chatRoom?.users &&
                chatRoom?.users
                  .filter((usr) => {
                    return usr._id !== user._id;
                  })
                  .map((roomUser) => {
                    const isOnline = onlineUsers?.some(
                      (onlineUser) => onlineUser.user._id === roomUser._id
                    );
                    return (
                      <div
                        key={roomUser._id}
                        className="flex items-center relative cursor-pointer"
                      >
                        <li className="mb-2 rounded-lg light-navbar py-1 px-2 drop-shadow-xl font-bold">
                          {roomUser.userName}
                        </li>
                        {isOnline && (
                          <div className="rounded-full h-2 w-2 bg-green-500 relative -top-4 right-1" />
                        )}
                      </div>
                    );
                  })}
            </ul>
          </div>
          <div className="w-full md:w-[70%] p-4 flex flex-col light-navbar">
            <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4">
              {messages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.author._id === user._id ? "items-end" : "items-start"
                    }`}
                  >
                    {msg.author._id !== user._id && (
                      <p className="text-xs italic mb-1">
                        {msg.author.userName}
                      </p>
                    )}
                    <div
                      className={` rounded-lg shadow-xl border-gray-200 min-w-10 max-w-40 flex
             ${
               msg.author._id === user._id
                 ? "bg-blue-600 text-right"
                 : "bg-zinc-600 text-left"
             }`}
                    >
                      <span
                        className={`inline-block px-1 py-1 rounded-lg text-[12px] ${
                          msg.author._id === user._id
                        } ? "bg-blue-500 text-white" : "bg-gray-200 text-white`}
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
              {/* <div ref={messagesEndRef} /> */}
            </div>
            <InputComponent
              input={input}
              showPicker={showPicker}
              setInput={setInput}
              setShowPicker={setShowPicker}
              handleSendMessage={handleSendMessage}
            />
            <Chat />
          </div>
        </div>
      }
    />
  );
};

export default ChatRoom;
