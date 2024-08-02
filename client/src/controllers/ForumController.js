import axios from "axios";
import { postsRoute } from "../utils/ApiRoutes";
import { toast } from "react-toastify";

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${postsRoute}/posts`);
    if (response.status == 200) {
      return response;
    }
    return null;
  } catch (error) {
    console.log("Error: ", error);
    toast.error(error.response.data.msg);
  }
};

export const createPost = async (post, token) => {
  console.log("in create post");
  try {
    const res = await axios.post(`${postsRoute}/post`, post, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response: ", res);
    return res;
  } catch (error) {
    console.log("Error: ", error);
    toast.error(error.response.data.msg);
  }
};

export const updatePost = async (id, post, token) => {
  await axios.put(`${postsRoute}/post/${id}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
    console.log("Comment Response: ", commentResponse);
    return commentResponse.data;
  } catch (error) {
    console.log("Error: ", error);
    toast.error(error.response.data.msg);
  }
};
