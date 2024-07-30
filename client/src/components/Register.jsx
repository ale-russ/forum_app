import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { register } from "../controllers/AuthController";
import Loader from "./common/Loader";

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
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <main className="register">
      <h1 className="registerTitle">Create an account</h1>
      {loading ? (
        <Loader />
      ) : (
        <form className="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            required
            value={values.username}
            onChange={(event) => handleChange(event)}
          />
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            name="email"
            id="email"
            required
            value={values.email}
            onChange={(event) => handleChange(event)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={values.password}
            onChange={(event) => handleChange(event)}
          />
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            required
            value={values.confirm_password}
            onChange={(event) => handleChange(event)}
          />
          <button className="registerBtn">REGISTER</button>
          <p>
            Have an account? <Link to="/">Sign in</Link>
          </p>
        </form>
      )}
      <ToastContainer />
    </main>
  );
};

export default Register;
