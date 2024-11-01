import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const { onlineUsers, token, user, threads, setThreads } = useForum();
  const socket = useSocket();
  const navigate = useNavigate();

  const [newMessages, setNewMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [isRoomFetched, setIsRoomFetched] = useState(false);
  const [userList, setUserList] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const handleNewMessage = ({ chatId, author, message, isPost }) => {
    if (isPost) {
      const newMsg = {
        id: chatId,
        author: author,
        message: message,
        isPost: isPost,
      };

      setNewMessages((prev) => [...prev, newMsg]);
      setHasUnreadMessages(true);
      // console.log("New message: ", newMessages);
    } else {
      setNewMessages((prev) => [...prev, message]);
      setHasUnreadMessages(true);
    }

    // console.log("new message: ", newMessages);
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

  const handleFetchRooms = useCallback(async () => {
    try {
      setRoomsLoading(true);
      await fetchRooms().then((value) => {
        setChatRooms(value?.data);
        setIsRoomFetched(true);
      });
      console.log(`rooms fetched: ${isRoomFetched}`);
      return chatRooms;
    } finally {
      setRoomsLoading(false);
    }
  });

  const handleGeneralRoomUser = () => {
    // console.log("in handle general room user");
    // console.log(`chatRooms: ${chatRooms}`);
    if (chatRooms && chatRooms?.[0]) {
      const isUserInGeneralRoom = chatRooms[0]?.users?.some(
        (usr) => usr?._id === user?._id
      );
      // console.log(`isUserInGeneralRoom: ${isUserInGeneralRoom}`);
      if (!isUserInGeneralRoom) {
        // console.log("joining general room");
        socket?.emit("join chat room", {
          roomId: chatRooms[0]?._id,
          userId: user?._id,
        });
        // console.log(` after: ${isUserInGeneralRoom}`);
      }
    }
  };

  const handleFetchUsers = async () => {
    try {
      const response = await fetchAllUsers(token);
      setUserList(response);
    } catch (err) {
      toast.error("Failed to fetch users", toastOptions);
    }
  };

  useEffect(() => {
    const handleError = (errorMessage) => {
      // console.error("Socket error:", errorMessage);
    };
    if (socket) {
      const handlePrivateMessage = ({ message }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        handleNewMessage({
          chatId: message.recipient,
          author: message.userName,
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
    // if (!isRoomFetched) {
    // }
    // handleGeneralRoomUser();
    if (isRoomFetched && chatRooms?.length && user) {
      handleGeneralRoomUser();
    }
    // console.log(`isRoomFetched: ${isRoomFetched}`);
  }, [isRoomFetched, chatRooms, user]);

  useEffect(() => {
    handleFetchRooms();
  }, []);

  useEffect(() => {
    // console.log("new notification: ", newMessages);
  }, [newMessages]);

  useEffect(() => {
    socket?.on("new post notification", ({ post, author }) => {
      handleNewMessage({
        chatId: post?._id,
        author: author,
        message: post,
        isPost: true,
      });
    });

    socket?.on("new post broadcast", ({ post, author }) => {
      setThreads((prev) => [...prev, post]);
    });

    return () => {
      socket?.off("new post notification");
      socket?.off("new post broadcast");
    };
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
        roomsLoading,
        setUserList,
        setHasUnreadMessages,
        setNotifications,
        setNewMessages,
        setMessages,
        setRoomsLoading,
        setChatRooms,
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
