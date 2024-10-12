import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";

import { UserAuthContext } from "./UserAuthenticationProvider";
import {
  createPost,
  fetchPosts,
  likePost,
  deletePost,
  followUnfollowUser,
} from "../controllers/ForumController";
import { toastOptions } from "./constants";
import { useSocket } from "./SocketContext";
import { handleGetUserInfo } from "../controllers/AuthController";
import { useNavigate } from "react-router-dom";

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

export const ForumProvider = ({ children }) => {
  const navigate = useNavigate();
  const { token } = useContext(UserAuthContext);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const socket = useSocket();

  const [threads, setThreads] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [commentCounts, setCommentCounts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [postComments, setPostComments] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [followedUsers, setFollowedUsers] = useState(new Set());

  const sortNewPosts = (data) => {
    const sortedPosts = [...data].sort((a, b) => {
      const aTimestamp = Date.parse(a.createdAt);
      const bTimestamp = Date.parse(b.createdAt);
      return bTimestamp - aTimestamp;
    });

    setThreads(sortedPosts);
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit("user connected", user?._id);

    socket.on("update user list", (users) => {
      setOnlineUsers(users);
    });

    const handleNewComment = (post) => {
      console.log("in post context useEffect");
      setCommentCounts((prev) => ({
        ...prev,
        [post?._id ?? post?.id]: (prev[id] || 0) + 1,
      }));
    };

    socket.on("new comment", handleNewComment);

    return () => {
      socket.off("new comment", handleNewComment);
    };
  }, [socket, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const userFollowing = user?.following || [];
    setFollowedUsers(
      new Set(
        userFollowing
          .filter((followingUser) => followingUser._id !== user?._id)
          .map((followingUser) => followingUser._id)
      )
    );
  }, []);

  const handleGetUpdatedUserInfo = async () => {
    const data = await handleGetUserInfo(token);
    localStorage.setItem("currentUser", JSON.stringify(data));
  };

  const handleFetchPosts = useCallback(async () => {
    setPostLoading(true);
    try {
      const response = await fetchPosts(token);

      if (response && response.data) {
        // setThreads(response.data);
        sortNewPosts(response.data);
      } else {
        return "No Data found";
      }
      handleGetUpdatedUserInfo();
    } catch (err) {
      toast.error("Failed to fetch posts", toastOptions);
    } finally {
      setPostLoading(false);
    }
  });

  const handleCreatePost = async () => {
    setPostLoading(true);
    try {
      if (newPost.title === "" || newPost.content === "") {
        toast.error("Title and Content cannot be empty", toastOptions);
        return;
      }
      const response = await createPost(newPost, token);

      if (response && response?.data) {
        setThreads([...threads, response.data]);
        socket?.emit("new post", { post: response?.data });
      }
    } catch (err) {
      console.log("Error in context post creation: ", err);
      toast.error("Failed to create post", toastOptions);
    } finally {
      setNewPost({ title: "", content: "" });
      setPostLoading(false);
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

  const handleFollowUnFollowUser = async (post) => {
    const response = await followUnfollowUser({
      userId: post?.author?._id,
      token,
    });
    if (response?.data?.isFollowing) {
      setFollowedUsers((prev) => new Set(prev).add(post?.author?._id));
    } else {
      setFollowedUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(post.author._id);
        return updated;
      });
    }

    await handleGetUpdatedUserInfo();
  };

  const handleDeletePost = async (post) => {
    setPostLoading(true);
    try {
      await deletePost(post._id, token);
      setThreads(threads.filter((t) => t._id !== post._id));
    } catch (error) {
      toast.error("Failed to delete post", toastOptions);
    }
    setPostLoading(false);
  };

  return (
    <ForumContext.Provider
      value={{
        newPost,
        threads,
        likeCounts,
        isLiked,
        commentCounts,
        user,
        token,
        postComments,
        currentPost,
        onlineUsers,
        postLoading,
        dimensions,
        followedUsers,
        setDimensions,
        setPostComments,
        setNewPost,
        setLikeCounts,
        setThreads,
        setPostLoading,
        handleFetchPosts,
        handleCreatePost,
        handleLikePost,
        handleDeletePost,
        handleGetUpdatedUserInfo,
        handleFollowUnFollowUser,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};
