import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { register } from "../controllers/AuthController";
import Loader from "../components/common/Loader";
import toastOptions from "../utils/constants";
import UploadImage from "../components/common/UploadImage";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [image, setImage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      values.username === "" ||
      values.email === "" ||
      values.password === "" ||
      values.confirm_password === ""
    ) {
      toast.error("All Fields are required", toastOptions);
      return;
    }
    try {
      setLoading(true);

      await register({ values, image });
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.msg, toastOptions);
    } finally {
      setValues({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <main className="flex flex-col items-center py-16 px-4 m-auto h-full">
      {loading ? (
        <Loader />
      ) : (
        <div className="m-auto border shadow-xl rounded-lg light-navbar py-8 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[40%]">
          <h1 className="flex items-center justify-center px-4 text-[#FF571A] font-bold text-xl">
            Create an account
          </h1>
          <form
            className="flex flex-col items-start justify-center px-4 gap-y-4 "
            onSubmit={handleSubmit}
          >
            <label htmlFor="username">Username</label>
            <input
              className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
              type="text"
              name="username"
              id="username"
              required
              value={values.username}
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="email">Email Address</label>
            <input
              className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
              type="text"
              name="email"
              id="email"
              required
              value={values.email}
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="password">Password</label>
            <input
              className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
              type="password"
              name="password"
              id="password"
              required
              value={values.password}
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
              type="password"
              name="confirm_password"
              id="confirm_password"
              required
              value={values.confirm_password}
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="profile_image">Profile Image</label>
            <UploadImage setImage={setImage} />
            <button className="mx-auto rounded bg-[#FF571A] h-10 text-sm px-3 my-2 shadow-lg text-white">
              REGISTER
            </button>
            <div className="flex items-center justify-center mx-auto">
              <p>
                Have an account?{" "}
                <Link className="underline" to="/">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
      {/* <ToastContainer /> */}
    </main>
  );
};

export default Register;
