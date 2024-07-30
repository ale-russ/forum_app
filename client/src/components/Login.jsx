import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../controllers/AuthController";
import Loader from "./common/Loader";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ values });
    try {
      setLoading(true);
      await login({ values });
    } finally {
      setValues({
        email: "",
        password: "",
      });
      setLoading(false);
      navigate("/dashboard");
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <main className="login">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="loginTitle">Log in to your account</h1>

          <form className="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={(event) => handleChange(event)}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={(event) => handleChange(event)}
              required
            />

            <button className="loginBtn">SIGN IN</button>

            <p>
              Don't have an account ? <Link to="/register">Register</Link>
            </p>
          </form>
        </>
      )}
      <ToastContainer />
    </main>
  );
};

export default Login;
