import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

import { UserAuthContext } from "./UserAuthenticationProvider";
import {
  createPost,
  fetchPosts,
  addComment,
  likePost,
} from "../controllers/ForumController";
import toastOptions from "./constants";
import { fetchRooms } from "../controllers/ChatController";

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

export const ForumProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [threads, setThreads] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [postComments, setPostComments] = useState([]);

  const { token } = useContext(UserAuthContext);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleFetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetchPosts();

      if (response && response.data) {
        setThreads(response.data);
      } else {
        return "No Data found";
      }
    } finally {
      setLoading(false);
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
      return newComment;
    } catch (err) {
      toast.error("Failed to add comment", toastOptions);
    }
  };

  const handleLikePost = async (post) => {
    const id = post._id;
    const response = await likePost({ id, token });
  };

  const handleFetchRooms = async () => {
    const response = await fetchRooms();

    setChatRooms(response?.data);
    return response?.data;
  };

  return (
    <ForumContext.Provider
      value={{
        newPost,
        loading,
        loadingComment,
        threads,
        chatRooms,
        postComments,
        user,
        token,
        setNewPost,
        handleFetchPosts,
        handleCreatePost,
        handleAddComment,
        handleLikePost,
        handleFetchRooms,
        setPostComments,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};
