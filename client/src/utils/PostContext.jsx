import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

import { UserAuthContext } from "./UserAuthenticationProvider";
import {
  createPost,
  fetchPosts,
  addComment,
  likePost,
  getSinglePost,
} from "../controllers/ForumController";
import toastOptions from "./constants";
import { fetchRooms } from "../controllers/ChatController";
import { host } from "../utils/ApiRoutes";
import Loader from "../components/common/Loader";
import { useSocket } from "./SocketContext";

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

export const ForumProvider = ({ children }) => {
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

  const { token } = useContext(UserAuthContext);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const socket = useSocket();

  // console.log("socket ", socket);

  const handleFetchPosts = async () => {
    try {
      const response = await fetchPosts();
      if (response && response.data) {
        setThreads(response.data);
      } else {
        return "No Data found";
      }
    } catch (err) {
      toast.error("Failed to fetch posts", toastOptions);
    }
  };

  const handleSinglePost = async (id) => {
    const response = await getSinglePost(id, token);
    setCurrentPost(response?.data);
    if (response?.data) {
      return response?.data;
    } else {
      toast.error("No Data Found");
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

  const handleAddComment = async (post, content) => {
    try {
      const response = await addComment(post._id, { content }, token);
      const newComment = {
        ...response?.data,
        author: { userName: user.userName, _id: user._id },
      };
      setThreads((prevThreads) =>
        prevThreads.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );
      setCommentCounts((prev) => ({
        ...prev,
        [post._id]: (prev[post._id] || post.comments?.length || 0) + 1,
      }));
      return newComment;
    } catch (err) {
      toast.error("Failed to add comment", toastOptions);
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

  useEffect(() => {
    // if (socket) {
    socket.emit("user connected", user?._id);

    socket?.on("update user list", (users) => {
      // console.log("Updated Users");
      setOnlineUsers(users);
    });

    const handleNewComment = ({ id }) => {
      setCommentCounts((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    };

    socket?.on("new comment", handleNewComment);

    return () => {
      socket?.off("new comment", handleNewComment);
    };
    // }
  }, []);

  const handleFetchRooms = async () => {
    const response = await fetchRooms();
    setChatRooms(response?.data);
    return response?.data;
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
        setPostComments,
        setNewPost,
        setLikeCounts,
        handleFetchPosts,
        handleCreatePost,
        handleAddComment,
        handleLikePost,
        handleFetchRooms,
        handleSinglePost,
      }}
    >
      {loading ? <Loader /> : <>{children}</>}
    </ForumContext.Provider>
  );
};
