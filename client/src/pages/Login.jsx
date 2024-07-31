import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../controllers/AuthController";
import Loader from "../components/common/Loader";
import { ToastContainer } from "react-toastify";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";

const Login = () => {
  const navigate = useNavigate();
  const { token } = useContext(UserAuthContext);
  const { setUserAuth } = useContext(UserAuthContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ values });
    try {
      setLoading(true);
      await login({ values });
      setUserAuth({ newToken: localStorage.getItem("token") });
      navigate("/home");
    } finally {
      setValues({
        email: "",
        password: "",
      });
      setLoading(false);
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
    </main>
  );
};

export default Login;
