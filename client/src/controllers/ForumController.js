import axios from "axios";
import {
  postsRoute,
  deletePostRoute,
  followUnfollowRoute,
} from "../utils/ApiRoutes";
import { toast } from "react-toastify";

import { toastOptions } from "../utils/constants";

export const fetchPosts = async (token) => {
  try {
    const response = await axios.get(`${postsRoute}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status == 200) {
      return response;
    }
    return null;
  } catch (error) {
    console.log("Error: ", error.response.status);
    if (error.response.status === 401) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    toast.error(error.response?.data.msg, toastOptions);
  }
};

export const getSinglePost = async (id, token) => {
  try {
    const response = await axios.get(`${postsRoute}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response;
    return null;
  } catch {
    toast.error("Oops! Something went wrong", toastOptions);
  }
};

export const createPost = async (post, token) => {
  // console.log("Post: ", post);
  try {
    const res = await axios.post(`${postsRoute}/post`, post, {
      headers: { Authorization: `${token}` },
    });

    return res;
  } catch (err) {
    // console.log("Error: ", err);
    toast.error(err.response.data.msg, toastOptions);
  }
};

export const updatePost = async ({ post, token }) => {
  try {
    const response = await axios.put(`${postsRoute}/post/${post._id}`, post, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Updated Post: ", response);
    return response;
  } catch (error) {
    console.log("Error: " + error);
    toast.error(error.response.data.msg, toastOptions);
  }
};

export const handleSearch = async (searchQuery, token) => {
  try {
    const { data } = await axios.get(
      `${postsRoute}/search?query=${searchQuery}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (error) {
    console.log("Error: ", error);
    toast.error("Oops!. Something went wrong", toastOptions);
  }
};

export const deletePost = async (id, token) => {
  try {
    await axios.delete(
      `${deletePostRoute}/${id}`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Post deleted successfully", toastOptions);
  } catch (error) {
    console.log("ERror: ", error);
    toast.error("Oops! Something Went wrong", toastOptions);
  }
};

export const addComment = async (id, comment, token) => {
  try {
    const commentResponse = await axios.post(
      `${postsRoute}/post/${id}/comments`,
      comment,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return commentResponse.data;
  } catch (error) {
    toast.error(error.response.data.msg, toastOptions);
  }
};

export const likePost = async (id, token) => {
  try {
    const response = await axios.post(
      `${postsRoute}/post/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response;
  } catch (error) {
    toast.error(error.response.data.msg, toastOptions);
  }
};

export const updateViewCount = async ({ postId, token }) => {
  try {
    const response = await axios.post(
      `${postsRoute}/post/${postId}/view`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.views;
  } catch (error) {
    toast.error(error.response.data.msg, toastOptions);
  }
};

export const followUnfollowUser = async ({ userId, token }) => {
  try {
    const response = await axios.post(
      `${followUnfollowRoute}/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (err) {
    // console.log("Error: ", err);
    toast.error("Failed to follow/unfollow user", toastOptions);
  }
};
