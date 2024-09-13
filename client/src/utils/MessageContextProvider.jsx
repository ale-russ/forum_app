import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useForum } from "./PostContext";
import { useSocket } from "./SocketContext";
import { useNavigate } from "react-router-dom";
import { fetchRooms } from "../controllers/ChatController";
import { toastOptions } from "./constants";
import { fetchAllUsers } from "../controllers/AuthController";

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

const MessageContextProvider = ({ children }) => {
  const { onlineUsers, token, user, threads } = useForum();
  const socket = useSocket();
  const navigate = useNavigate();

  const [newMessages, setNewMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [isRoomFetched, setIsRoomFetched] = useState(false);
  const [userList, setUserList] = useState([]);

  const handleNewMessage = ({ chatId, senderName, message, isPost }) => {
    if (isPost) {
      const newMsg = {
        id: chatId,
        author: message?.author,
        senderName: senderName,
        message: message,
        isPost: isPost,
      };
      setNewMessages((prev) => [...prev, newMsg]);
    } else {
      setNewMessages((prev) => [...prev, message]);
      setHasUnreadMessages(true);
    }
  };

  const navigateToChat = (chatId) => {
    const chatUser = onlineUsers?.find(({ user }) => user._id === chatId);
    navigate(`/chat/private-chat/${chatId}`, {
      state: { recipient: chatUser.user },
    });
    setNotifications({});
  };

  const clearUnreadMessages = (chatId) => {
    setNewMessages((prev) => prev.filter((msg) => msg.chatId !== chatId));
    setHasUnreadMessages(newMessages.length > 1); // Check if there are still unread messages
  };

  const handleFetchRooms = async () => {
    await fetchRooms().then((value) => {
      setChatRooms(value?.data);
      setIsRoomFetched(true);
    });

    return chatRooms;
  };

  const handleGeneralRoomUser = () => {
    if (chatRooms && chatRooms?.[0]) {
      const isUserInGeneralRoom = chatRooms[0]?.users?.some(
        (usr) => usr?._id === user?._id
      );
      if (!isUserInGeneralRoom) {
        socket?.emit("join chat room", {
          roomId: chatRooms[0]?._id,
          userId: user?._id,
        });
      }
    }
  };

  const handleFetchUsers = async () => {
    try {
      const response = await fetchAllUsers(token);
      setUserList(response);
    } catch (err) {
      // console.log("Error: ", err);
      toast.error("Failed to fetch users", toastOptions);
    }
  };

  useEffect(() => {
    const handleError = (errorMessage) => {
      console.error("Socket error:", errorMessage);
    };
    if (socket) {
      const handlePrivateMessage = ({ message }) => {
        console.log("Message: ", message);
        setMessages((prevMessages) => [...prevMessages, message]);
        handleNewMessage({
          chatId: message.recipient,
          senderName: message.userName,
          message: message,
        });
      };
      socket.on("private message", handlePrivateMessage);
      socket.on("error", handleError);

      return () => {
        socket.off("private message", handlePrivateMessage);
        socket.off("error", handleError);
      };
    }
  }, [socket, handleNewMessage]);

  useEffect(() => {
    handleFetchRooms();
  }, []);

  useEffect(() => {
    if (!isRoomFetched) {
      handleGeneralRoomUser();
    }
  }, [isRoomFetched]);

  useEffect(() => {
    // console.log("new notification: ", newMessages);
  }, [newMessages]);

  useEffect(() => {
    socket?.on("new post notification", ({ post, author }) => {
      handleNewMessage({
        chatId: post?._id,
        senderName: author,
        message: post,
        isPost: true,
      });
    });
    // setHasUnreadMessages(true);
  }, [threads]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        newMessages,
        hasUnreadMessages,
        notifications,
        userList,
        chatRooms,
        setUserList,
        setHasUnreadMessages,
        setMessageNotification: setNotifications,
        setNewMessages,
        setMessages,
        handleNewMessage,
        navigateToChat,
        handleFetchRooms,
        handleGeneralRoomUser,
        clearUnreadMessages,
        handleFetchUsers,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;
