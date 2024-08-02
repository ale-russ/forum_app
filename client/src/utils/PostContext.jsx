import React, { Children, createContext, useContext, useState } from "react";

import { UserAuthContext } from "./UserAuthenticationProvider";
import {
  createPost,
  fetchPosts,
  addComment,
} from "../controllers/ForumController";

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

export const ForumProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [threads, setThreads] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const { token } = useContext(UserAuthContext);

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
      const response = await createPost(newPost, token);
      console.log("TOKEN: ", token);
      console.log("Response: $", response);
      if (response && response.data) {
        setThreads([...threads, response.data.data]);
      }
    } finally {
      setNewPost({ title: "", content: "" });
      setLoading(false);
    }
  };

  const handleAddComment = async (post, e) => {
    e.preventDefault();
    setLoadingComment(true);
    try {
      const response = await addComment(
        post._id,
        { content: e.target.value },
        token
      );
      setThreads(
        threads.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, response.data] }
            : p
        )
      );
    } finally {
      setLoadingComment(false);
      e.target.value = "";
    }
  };

  return (
    <ForumContext.Provider
      value={{
        newPost,
        loading,
        loadingComment,
        threads,
        setNewPost,
        handleFetchPosts,
        handleCreatePost,
        handleAddComment,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};
