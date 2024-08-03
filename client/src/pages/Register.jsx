import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { register } from "../controllers/AuthController";
import Loader from "../components/common/Loader";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ values });
    try {
      setLoading(true);
      await register({ values });
    } finally {
      setValues({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setLoading(false);
      navigate("/");
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <main className="dark flex flex-col items-center p-16 m-auto">
      {loading ? (
        <Loader />
      ) : (
        <div className="m-auto shadow-xl rounded-lg dark-navbar py-8 w-96">
          <h1 className="flex items-center justify-center px-4 text-[#FF571A] font-bold text-xl">
            Create an account
          </h1>
          <form
            className="flex flex-col items-start justify-center px-4 gap-y-4 "
            onSubmit={handleSubmit}
          >
            <label htmlFor="username">Username</label>
            <input
              className="bg-[#2C353D] border-0 h-10 text-[#858EAD] outline-none w-full"
              type="text"
              name="username"
              id="username"
              required
              value={values.username}
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="email">Email Address</label>
            <input
              className="bg-[#2C353D] border-0 h-10 text-[#858EAD] outline-none w-full"
              type="text"
              name="email"
              id="email"
              required
              value={values.email}
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="password">Password</label>
            <input
              className="bg-[#2C353D] border-0 h-10 text-[#858EAD] outline-none w-full"
              type="password"
              name="password"
              id="password"
              required
              value={values.password}
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              className="bg-[#2C353D] border-0 h-10 text-[#858EAD] outline-none w-full"
              type="password"
              name="confirm_password"
              id="confirm_password"
              required
              value={values.confirm_password}
              onChange={(event) => handleChange(event)}
            />
            <button className="mx-auto rounded bg-[#FF571A] h-10 text-sm px-3 my-2 shadow-lg">
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
