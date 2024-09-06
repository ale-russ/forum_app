import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

import { UserAuthContext } from "./UserAuthenticationProvider";
import {
  createPost,
  fetchPosts,
  likePost,
  deletePost,
} from "../controllers/ForumController";
import { toastOptions } from "./constants";
import { fetchRooms } from "../controllers/ChatController";
import { useSocket } from "./SocketContext";
import {
  fetchAllUsers,
  handleGetUserInfo,
} from "../controllers/AuthController";
import { useNavigate } from "react-router-dom";

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

export const ForumProvider = ({ children }) => {
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [commentCounts, setCommentCounts] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [postComments, setPostComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [messageNotification, setMessageNotification] = useState({});
  const [isRoomFetched, setIsRoomFetched] = useState(false);
  const [newMessages, setNewMessages] = useState([{}]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [userList, setUserList] = useState([]);

  const { token } = useContext(UserAuthContext);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.emit("user connected", user?._id);

    socket.on("update user list", (users) => {
      setOnlineUsers(users);
    });

    const handleNewComment = ({ id }) => {
      setCommentCounts((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    };

    socket.on("new comment", handleNewComment);

    socket.on("new message", handleNewMessage);

    return () => {
      socket.off("new comment", handleNewComment);
      socket.off("new message", handleNewMessage);
    };
  }, [socket, navigate, newMessages]);

  useEffect(() => {
    handleFetchRooms();

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isRoomFetched) {
      handleGeneralRoomUser();
    }
  }, [isRoomFetched]);

  useEffect(() => {
    // console.log("new notification: ", messageNotification);
  }, [newMessages]);

  const handleGetUpdatedUserInfo = async () => {
    const data = await handleGetUserInfo(token);
    localStorage.setItem("currentUser", JSON.stringify(data));
  };

  const handleFetchPosts = async () => {
    setPostLoading(true);
    try {
      const response = await fetchPosts();

      if (response && response.data) {
        setThreads(response.data);
      } else {
        return "No Data found";
      }
    } catch (err) {
      toast.error("Failed to fetch posts", toastOptions);
    } finally {
      setPostLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newPost.title === "" || newPost.content === "") {
        toast.error("Title and Content cannot be empty", toastOptions);
        return;
      }
      const response = await createPost(newPost, token);
      if (response && response?.data) {
        setThreads([...threads, response.data]);
      }
    } catch (err) {
      toast.error("Failed to create post", toastOptions);
    } finally {
      setNewPost({ title: "", content: "" });
      setLoading(false);
    }
  };

  const handleLikePost = async (id) => {
    const response = await likePost(id, token);
    setThreads((prevThreads) =>
      prevThreads.map((pst) =>
        pst._id === id ? { ...pst, likes: response?.data?.likes } : pst
      )
    );
    return response?.data;
  };

  const handleDeletePost = async (post) => {
    // setPostLoading(true);
    try {
      // if (post.author._id !== user._id) {
      //   toast.error("You are not authorized to delete this post", toastOptions);
      //   return;
      // }
      await deletePost(post._id, token);
      setThreads(threads.filter((t) => t._id !== post._id));
    } catch (error) {
      toast.error("Failed to delete post", toastOptions);
    }
    // setPostLoading(false);
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

  const handleNewMessage = ({ chatId, senderName, message }) => {
    console.log("handleNewMessage: ", message);
    setNewMessages((prev) => [...prev, message]);
    toast.info(`New message from ${senderName}: ${message.content}`, {
      ...toastOptions,
      onClick: () => navigateToChat(chatId),
    });
    console.log("new message in handleNewMessage: ", newMessages);
  };

  const navigateToChat = (chatId) => {
    navigate(`/chat/private-chat/${chatId}`);
    setMessageNotification({});
  };

  const clearUnreadMessages = (chatId) => {
    setNewMessages((prev) => prev.filter((msg) => msg.chatId !== chatId));
    if (newMessages.length === 0) {
      setHasUnreadMessages(false);
    }
  };

  return (
    <ForumContext.Provider
      value={{
        newPost,
        threads,
        likeCounts,
        isLiked,
        commentCounts,
        chatRooms,
        user,
        token,
        postComments,
        currentPost,
        onlineUsers,
        postLoading,
        messageNotification,
        dimensions,
        userList,
        newMessages,
        setDimensions,
        setMessageNotification,
        setPostComments,
        setNewPost,
        setLikeCounts,
        setNewMessages,
        handleFetchPosts,
        handleCreatePost,
        handleLikePost,
        handleFetchRooms,
        // handleSinglePost,
        handleDeletePost,
        handleFetchUsers,
        handleGetUpdatedUserInfo,
        handleNewMessage,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};
