import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../controllers/AuthController";
import Loader from "../components/common/Loader";
import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import { useGoogleLogin } from "@react-oauth/google";

import { UserAuthContext } from "../utils/UserAuthenticationProvider";
import { toastOptions } from "../utils/constants";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { token, currentUser } = useContext(UserAuthContext);
  const { setUserAuth } = useContext(UserAuthContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState({});

  // const onGoogleLoginSuccess = async (res) => {
  //   console.log("response: ", res);
  //   const { credential } = res;
  //   setUser({ ...res });
  //   console.log("user credential: ", credential);
  //   const token = jwtDecode(credential);
  //   console.log("token: ", token);
  //   try {
  //     if (Object.keys(user).length !== 0) {
  //       const response = await axios.get(
  //         `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             Accept: "application/json",
  //           },
  //         }
  //       );

  //       console.log("RESPONSE: ", response);
  //     } else {
  //       console.log("User not found");
  //       return;
  //     }
  //     toast.success("User successfully logged in", toastOptions);
  //   } catch (err) {
  //     console.log("Error: ", err.response.data.error.message);
  //     toast.error("Internal Server Error", toastOptions);
  //   }
  // };

  useEffect(() => {
    if ((token, currentUser)) {
      navigate("/home");
    }
  }, [token, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login({ values });
      setUserAuth({
        newToken: localStorage.getItem("token"),
        newUser: JSON.parse(localStorage.getItem("currentUser")),
      });
      navigate("/home");
    } finally {
      setValues({
        email: "",
        password: "",
      });
      setLoading(false);
    }
  };

  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => console.log(codeResponse),
  //   flow: "auth-code",
  // });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <main className="flex flex-col items-center py-16 px-4 m-auto h-full">
      {loading ? (
        <Loader />
      ) : (
        <div className="m-auto flex-col justify-center items-center border shadow-xl rounded-lg light-navbar py-8 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] xl:w-[30%] h-[60%">
          <h1 className="flex items-center justify-center px-4 text-[#FF571A] font-bold text-xl">
            Log in to your account
          </h1>

          <form
            className="flex flex-col items-start justify-center px-4 gap-y-4 "
            onSubmit={handleSubmit}
          >
            <label htmlFor="email">Email:</label>
            <input
              className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={(event) => handleChange(event)}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={(event) => handleChange(event)}
              required
            />

            <button className="mx-auto rounded bg-[#FF571A] h-10 text-sm px-3 my-2 shadow-lg text-white">
              SIGN IN
            </button>
            {/* <div className="mx-auto">
              <button onClick={() => login()}>Sign in with Google 🚀</button>
            </div> */}
            <div className="block text-center mx-auto cursor-pointer">
              <Link className="underline" to="/request-password-reset">
                <p>Forget Password</p>
              </Link>
            </div>
            <div className="flex items-center justify-between mx-auto">
              <p>
                Don't have an account ?{" "}
                <Link className="underline" to="/register">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default Login;
