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

      console.log("REs in Con: ", response);

      if (response && response?.data) {
        setThreads([...threads, response.data]);
        console.log("Response in Context: $", threads);
      }
    } finally {
      setNewPost({ title: "", content: "" });
      setLoading(false);
    }
  };

  const handleAddComment = async (post, content) => {
    setLoadingComment(true);
    try {
      const response = await addComment(post._id, { content }, token);
      console.log("Comment Response: ", response);
      const newComment = {
        ...response?.data,
        author: { userName: user.userName, _id: user._id },
      };
      setThreads((prvThreads) =>
        prvThreads.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );
      return newComment;
    } finally {
      setLoadingComment(false);
    }
  };

  const handleLikePost = async (post) => {
    console.log("in handleLike", post._id);
    const id = post._id;
    const response = await likePost({ id, token });
    console.log("Like Response: ", response);
  };

  const handleFetchRooms = async () => {
    const { data } = await fetchRooms();
    setChatRooms(data);
    // console.log("ROOMS: ", chatRooms);
    return data;
  };

  return (
    <ForumContext.Provider
      value={{
        newPost,
        loading,
        loadingComment,
        threads,
        chatRooms,
        setNewPost,
        handleFetchPosts,
        handleCreatePost,
        handleAddComment,
        handleLikePost,
        handleFetchRooms,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};
