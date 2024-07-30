import axios from "axios";
import { toast } from "react-toastify";

// import toastOptions from "../utils/constants";
import toastOptions from "../utils/constants";

import { host, loginRoute, registerRoute } from "../utils/ApiRoutes";

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

export async function register({ values, navigate }) {
  console.log("Values in handleValidation: ", values);
  try {
    if (handleValidation({ values, isRegister: true })) {
      const { username, email, password, confirm_password } = values;

      const formData = new FormData();
      formData.append("userName", username);
      formData.append("email", email);
      formData.append("password", password);

      const { data } = await axios.post(
        "http://localhost:4000/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.status == false) {
        toast.error(`${data.msg}`, toastOptions);
        return;
      } else {
        console.log("SUCCESS");
        // navigate("/success", { state: { data: data.data } });
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response.data.message === "Phone number already exist!") {
      toast.error("User already exist", toastOptions);
    } else {
      toast.error("Oops! Something went wrong. Please try again", toastOptions);
    }
  }
}

// react-logic
export async function login({ values, navigate }) {
  try {
    if (handleValidation({ values, isRegister: false })) {
      const { email, password } = values;
      console.log("email: , password: ", email, password);

      const { data } = await axios.post(
        "http://localhost:4000/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.status === false) {
        toast.error(`${data.msg}`, toastOptions);
        return;
      } else {
        // navigate("/success", { state: { data: data.data } });
        // navigate("/dashboard");
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response.data.msg) {
      toast.error(error.response.data.msg, toastOptions);
    } else {
      toast.error("Oops! Something went wrong. Please try again", toastOptions);
    }
  }
}

export const handleLogout = async ({ token, navigate, endPoint }) => {
  var logoutRoute = `${host}/${endPoint}/`;
  const body = {
    access_token: token,
  };
  try {
    await axios.post(logoutRoute, body);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userType");

    navigate("/");
  } catch (error) {
    toast.error(error, toastOptions);
  }
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
