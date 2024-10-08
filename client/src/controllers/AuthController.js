import axios from "axios";
import { toast } from "react-toastify";

import { toastOptions } from "../utils/constants";

import {
  getAllUsersRoute,
  getCurrentUserInfo,
  host,
  loginRoute,
  registerRoute,
  requestPasswordResetRoute,
  resetPasswordRoute,
} from "../utils/ApiRoutes";

export function handleValidation({ values, isRegister = false }) {
  const { username, email, password, confirm_password } = values;

  if (isRegister) {
    if (username.length === 0) {
      toast.error("First name should be more than 3 characters", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email should not be empty", toastOptions);
      return false;
    } else if (password.length < 4) {
      toast.error("Password should be more than 4 characters", toastOptions);
      return false;
    } else if (isRegister && password !== confirm_password) {
      toast.error(
        "Password and confirm password should be similar",
        toastOptions
      );
      return false;
    }
    return true;
  } else {
    if (email === "") {
      toast.error("Email should not be empty", toastOptions);
      return false;
    } else if (password.length < 4) {
      toast.error("Password should be more than 4 characters", toastOptions);
      return false;
    }
    return true;
  }
}

export async function register({ values, image }) {
  try {
    if (handleValidation({ values, isRegister: true })) {
      const { username, email, password, confirm_password } = values;
      console.log("image: " + { image });

      const formData = new FormData();
      formData.append("userName", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      const { data } = await axios.post(registerRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.status == false) {
        toast.error(`${data.msg}`, toastOptions);
        return;
      } else {
        toast.success(
          "You have successfully registered. Please login with the new credentials",
          toastOptions
        );
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function login({ values }) {
  try {
    if (handleValidation({ values, isRegister: false })) {
      const { email, password } = values;

      const { data } = await axios.post(loginRoute, { email, password });

      if (data.token != null) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data));
        return data;
      } else {
        toast.error(`${data.msg}`, toastOptions);
        return;
      }
    }
  } catch (error) {
    toast.error(error.response.data.msg, toastOptions);
    return;
  }
}

export const fetchAllUsers = async (token) => {
  try {
    const { data } = await axios.get(
      `${getAllUsersRoute}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("ERROR FETCHING USERS: ", error);
    toast.error(error, toastOptions);
    return [];
  }
};

export const handleGetUserInfo = async (token) => {
  try {
    const response = await axios.get(`${getCurrentUserInfo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.log("Error: ", error);
    toast.error(error, toastOptions);
  }
};

export const handleLogout = async () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
};

export const handleDelete = async ({ token, endPoint, navigate }) => {
  var deleteRoute = `${host}/${endPoint}/`;

  const options = {
    access_token: token,
  };
  try {
    const res = await axios
      .post(deleteRoute, options)
      .catch((error) => toast.error(error, toastOptions));

    if (res.status === 200) {
      localStorage.clear();
      toast.success("Account deleted successfully!", toastOptions);
      navigate("/");
    }
  } catch (error) {
    toast.error(error, toastOptions);
  }
};

export async function requestPasswordReset(email) {
  console.log("email: ", email);
  try {
    await axios.post(`${requestPasswordResetRoute}`, { email });
  } catch (err) {
    throw err;
  }
}

export async function resetPassword(password, token) {
  try {
    await axios.post(
      `${resetPasswordRoute}`,
      { password, token },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    throw err;
  }
}
