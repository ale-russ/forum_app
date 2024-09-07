import React, { createContext, useContext, useEffect, useState } from "react";
import { useForum } from "./PostContext";
import { useSocket } from "./SocketContext";
import { useNavigate } from "react-router-dom";

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

const MessageContextProvider = ({ children }) => {
  const { onlineUsers } = useForum();
  const socket = useSocket();
  const navigate = useNavigate();

  const [newMessages, setNewMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [messageNotification, setMessageNotification] = useState([]);

  const handleNewMessage = ({ chatId, senderName, message }) => {
    setNewMessages((prev) => [...prev, message]);
    setHasUnreadMessages(true);
  };

  const navigateToChat = (chatId) => {
    const chatUser = onlineUsers?.find(({ user }) => user._id === chatId);
    navigate(`/chat/private-chat/${chatId}`, {
      state: { recipient: chatUser.user },
    });
    setMessageNotification({});
  };

  const clearUnreadMessages = (chatId) => {
    setNewMessages((prev) => prev.filter((msg) => msg.chatId !== chatId));
    setHasUnreadMessages(newMessages.length > 1); // Check if there are still unread messages
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
    console.log("new notification: ", newMessages);
  }, [newMessages]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        newMessages,
        hasUnreadMessages,
        messageNotification,
        setHasUnreadMessages,
        setMessageNotification,
        setNewMessages,
        setMessages,
        handleNewMessage,
        navigateToChat,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;
