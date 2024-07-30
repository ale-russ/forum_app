import axios from "axios";
import { postsRoute } from "../utils/ApiRoutes";

export const fetchPosts = () => axios.get(`${postsRoute}/posts`);

export const createPost = (post, token) =>
  axios.post(`${postsRoute}/posts`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePost = (id, post, token) => {
  axios.put(`${postsRoute}/post/${id}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deletePost = (id, token) =>
  axios.delete(`${postsRoute}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addComment = (id, comment, token) => {
  axios.post(`${postsRoute}/posts/${id}/comments`, comment, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
