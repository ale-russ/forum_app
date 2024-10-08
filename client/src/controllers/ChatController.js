import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";

import { toastOptions } from "../utils/constants";

import { chatRoute, privateChatRoute, host } from "../utils/ApiRoutes";

const socket = io(host);

export const postChatMessage = async (setMessages) => {
  socket.on("chat message", (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  return () => {
    socket.off("chat message");
  };
};

export const fetchChatMessages = async () => {
  try {
    const response = await axios.get(`${chatRoute}/messages`);
    if (response.status === 200) {
      return response;
    }
    return null;
  } catch (err) {
    toast.error(err.response?.data.msg, toastOptions);
  }
};

export const fetchPrivateMessages = async (author, recipient, token) => {
  try {
    const response = await axios.get(
      `${privateChatRoute}/${author}/${recipient}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response;
  } catch (err) {
    toast.error(err.response?.data.msg, toastOptions);
  }
};

export const updateChatMessage = async (id, token) => {
  try {
    const response = await axios.put(`${chatRoute}/message/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response;
    return null;
  } catch (err) {
    toast.error(err.response?.data.msg, toastOptions);
  }
};

export const deleteChatMessage = async (id, token) => {
  try {
    const response = await axios.delete(`${chatRoute}/message/:id`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) return response;
    return null;
  } catch (err) {
    toast.error(err.response?.data.msg, toastOptions);
  }
};

export const fetchRooms = async (token) => {
  try {
    const response = await axios.get(`${chatRoute}/chat-rooms`);
    return response;
  } catch (err) {
    toast.error(err.response?.data.msg, toastOptions);
  }
};
