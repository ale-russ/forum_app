import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import { host } from "../utils/ApiRoutes";
import Chat from "../components/chat/Chat";
import { useForum } from "../utils/PostContext";
import HomeWrapper from "../components/common/HomeWrapper";
import { InputComponent } from "../components/common/InputComponent";
import { useSocket } from "../utils/SocketContext";
import ProfileImage from "../components/common/ProfileImage";

// const socket = io(host);

const ChatRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const {
    chatRooms,
    user,
    handleFetchRooms,
    onlineUsers,
    dimensions,
    setDimensions,
  } = useForum();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(roomId);
  const [chatRoom, setChatRoom] = useState();
  const messagesEndRef = useRef(null);

  const [showPicker, setShowPicker] = useState(false);

  const smallScreen = dimensions.width < 768;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (roomId) socket?.emit("join room", roomId);

    socket?.on("chat room message", (message) => {
      setMessages((prevMessages) => {
        if (message.room === currentRoom) {
          return [...prevMessages, message];
        }
      });
      scrollToBottom();
    });

    socket?.on("user join", (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket?.on("user left", (user) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.name !== user));
    });

    return () => {
      if (roomId) {
        socket?.emit("leave room", roomId);
      }
      socket?.off("chat room message");
      socket?.off("user join");
      socket?.off("user left");
    };
  }, [roomId]);

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
      socket?.emit("chat room message", {
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
        <div className="flex flex-col md:flex-row w-full h-[90vh] shadow-xl border rounded-lg overflow-hidden">
          <div
            className={`${
              smallScreen ? "bg-zinc-800 text-white" : "light-search"
            } w-full md:w-[30%] h-28 md:h-full py-4 px-2 border-r`}
          >
            <h2 className="text-lg font-bold md:mb-4 flex items-center justify-center">
              Users
            </h2>
            <ul className="flex flex-row md:flex-col md:justify-start  overflow-x-auto md:overflow-x-hidden md:overflow-y-auto space-x-2 md:space-x-0 py-2">
              {chatRoom?.users &&
                chatRoom?.users
                  .filter((usr) => {
                    return usr._id !== user._id;
                  })
                  .map((usr) => {
                    const isOnline = onlineUsers?.some(
                      (onlineUser) => onlineUser.user._id === usr._id
                    );

                    return (
                      <div
                        key={usr._id}
                        className="flex items-center relative cursor-pointer md:w-full mx-2 md:mx-0"
                        onClick={() => {
                          navigate(`/chat/private-chat/${usr._id}`, {
                            state: { recipient: usr },
                          });
                        }}
                      >
                        {smallScreen ? (
                          <div className="flex flex-col items-center">
                            <ProfileImage author={usr} />
                            {usr.userName}
                          </div>
                        ) : (
                          <li className="mb-2 rounded-lg light-navbar py-1 px-2 shadow-lg font-bold w-full">
                            {usr.userName}
                          </li>
                        )}

                        {isOnline && (
                          <div className="rounded-full h-3 w-3 bg-green-500 relative -top-[24px] md:-top-4 right-5 md:right-1" />
                        )}
                      </div>
                    );
                  })}
            </ul>
          </div>
          <div className="w-full p-4 flex flex-col justify-between light-navbar h-[calc(90vh-6rem)] md:h-full">
            <div className="flex items-center justify-center font-bold w-full border-b-2">
              {chatRoom?.name}
            </div>
            <div className="w-full p-4 flex flex-col justify-between light-navbar overflow-y-auto space-y-2 scrollbar custom-scrollbar ">
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
              <div ref={messagesEndRef} />
            </div>
            <InputComponent
              input={input}
              showPicker={showPicker}
              setInput={setInput}
              setShowPicker={setShowPicker}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      }
    />
  );
};

export default ChatRoom;
