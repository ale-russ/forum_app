import React, { useContext } from "react";
import { handleLogout } from "../controllers/AuthController";
import { useNavigate } from "react-router-dom";

import { UserAuthContext } from "../utils/UserAuthenticationProvider";

const Nav = () => {
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserAuthContext);
  const signOut = async () => {
    await handleLogout({ navigate });
    setUserAuth({ newToken: "" });
    navigate("/");
  };
  return (
    <nav className="navbar">
      <h2>Threadify</h2>
      <div className="navbarRight">
        <button onClick={signOut}>Sign out</button>
      </div>
    </nav>
  );
};

export default Nav;
