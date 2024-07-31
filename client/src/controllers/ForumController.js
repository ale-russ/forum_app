import axios from "axios";
import { postsRoute } from "../utils/ApiRoutes";

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${postsRoute}/posts`);
    console.log("Response in controller: ", response);
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const createPost = async (post, token) => {
  try {
    await axios.post(`${postsRoute}/post`, post, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.log("Error: ", error);
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
  }
};
