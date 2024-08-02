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
    <main className="dark flex flex-col items-center p-16 m-auto">
      {loading ? (
        <Loader />
      ) : (
        <div className="m-auto shadow-xl rounded-lg dark-navbar py-8 w-96">
          <h1 className="flex items-center justify-center px-4 text-[#FF571A] font-bold text-xl">
            Log in to your account
          </h1>

          <form
            className="flex flex-col items-start justify-center px-4 gap-y-4 "
            onSubmit={handleSubmit}
          >
            <label htmlFor="email">Email:</label>
            <input
              className="bg-[#2C353D] border-0 h-10 text-[#858EAD] outline-none w-full"
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={(event) => handleChange(event)}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              className="bg-[#2C353D] border-0 h-10 text-[#858EAD] outline-none w-full"
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={(event) => handleChange(event)}
              required
            />

            <button className="mx-auto rounded bg-[#FF571A] h-10 text-sm px-3 my-2 shadow-lg">
              SIGN IN
            </button>

            <div className="flex items-center justify-center mx-auto">
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
