import axios from "axios";
import { postsRoute } from "../utils/ApiRoutes";
import { toast } from "react-toastify";

import toastOptions from "../utils/constants";

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${postsRoute}/posts`);
    if (response.status == 200) {
      return response;
    }
    return null;
  } catch (error) {
    toast.error(error.response?.data.msg, toastOptions);
  }
};

export const getSinglePost = async (id, token) => {
  try {
    const response = await axios.get(
      `${postsRoute}/posts/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) return response;
    return null;
  } catch {
    toast.error("Oops! Something went wrong", toastOptions);
  }
};

export const createPost = async (post, token) => {
  try {
    const res = await axios.post(`${postsRoute}/post`, post, {
      headers: { Authorization: `${token}` },
    });

    return res;
  } catch (error) {
    //
    toast.error(error.response.data.msg, toastOptions);
  }
};

export const updatePost = async (id, post, token) => {
  await axios.put(`${postsRoute}/post/${id}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const handleSearch = async (searchQuery, token) => {
  console.log("Token: ", token);
  try {
    const { data } = await axios.get(
      `${postsRoute}/search?query=${searchQuery}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Search Result: ", data);

    return data;
  } catch (error) {
    console.log("Error: ", error);
    toast.error("Oops!. Something went wrong", toastOptions);
  }
};

export const deletePost = async (id, token) =>
  await axios.delete(`${postsRoute}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

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
