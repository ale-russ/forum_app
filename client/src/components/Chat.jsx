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
  const [currentRoom, setCurrentRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      socket.emit("create room", roomName);
      setCurrentRoom(roomName);
      setRoomName("");
    }
  };

  const handleJoinRoom = (room) => {
    socket.emit("join room", room);
    setCurrentRoom(room);
  };

  const handleLeaveRoom = () => {
    socket.emit("leave room", currentRoom);
    setCurrentRoom("");
  };

  const handleChatMessages = async () => {
    try {
      const data = await fetchChatMessages();
      console.log("data: ", data);
      // Ensure data is an array before setting it
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setMessages([]); // Set to empty array in case of error
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const message = {
        author: user.userId,
        content: input,
        userName: user.userName,
      };

      console.log("Sending message:", { room: currentRoom, message });
      socket.emit("chat message", {
        room: currentRoom === "" ? "General" : currentRoom,
        message,
      });
      setInput("");
    }
  };

  useEffect(() => scrollToBottom, [messages]);

  useEffect(() => {
    handleChatMessages();
    socket.on("chat message", (message) => {
      console.log("Message", message);
      setMessages((prevMessages) => {
        // Ensure prevMessages is an array
        const messagesArray = Array.isArray(prevMessages) ? prevMessages : [];
        return [...messagesArray, message];
      });
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  // console.log("messages: ", messages);

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
          <div className="w-80 h-96 light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
              {messages?.data?.map((msg, index) => {
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
        )}
      </div>
    </div>
  );
};

export default Chat;
