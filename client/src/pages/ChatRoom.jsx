import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

import { host } from "../utils/ApiRoutes";
import Chat from "../components/chat/Chat";
import { useForum } from "../utils/PostContext";

const socket = io(host);

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [chatRoom, setChatRoom] = useState();
  const { chatRooms, user, handleFetchRooms } = useForum();
  const messagesEndRef = useRef(null);

  const [inputStr, setInputStr] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setInputStr((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => scrollToBottom, [messages]);

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
          [...prevMessages, message];
        }
        return prevMessages;
      });
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
      const matchedRoom = chatRooms.find((room) => room._id === roomId);
      if (matchedRoom) {
        setChatRoom(matchedRoom);
      } else {
      }
    };

    if (chatRooms.length === 0) {
      handleFetchRooms().then((fetchedRooms) => {
        const matchedRoom = fetchedRooms.find((room) => room._id === roomId);
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
        author: user.userId,
        userName: user.userName,
      };
      socket.emit("chat room message", {
        room: roomId,
        message,
      });
      setInput("");
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex h-[80%] w-[60%] shadow-xl border rounded-lg ">
        <div className="light-search w-full md:w-[30%] p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Users</h2>
          <ul>
            {chatRoom?.users &&
              chatRoom?.users.map((user) => (
                <li key={user._id} className="mb-2">
                  {user.userName}
                </li>
              ))}
          </ul>
        </div>
        <div className="w-full md:w-[70%] p-4 flex flex-col light-navbar">
          <div className="flex-1 overflow-y-auto mb-4">
            {chatRoom?.messages.map((msg, index) => {
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
          </div>
          <div className="flex w-[90%]">
            <img
              className="emoji-icon"
              src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
              onClick={() => setShowPicker((val) => !val)}
            />
            {showPicker && (
              <Picker
                className={`w-20 h-16 light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300 ${
                  showPicker ? "open-animation" : "close-animation"
                }`}
                // pickerStyle={{ width: "100%" }}
                onEmojiClick={onEmojiClick}
              />
            )}

            <input
              type="text"
              className="flex-1 light-search p-2 border rounded-l-lg focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <div ref={messagesEndRef} />
            <button
              className="bg-[#FF571A] text-white p-2 rounded-r-lg"
              onClick={handleSendMessage}
            >
              <IoMdSend />
            </button>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
