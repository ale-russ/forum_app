import React, { createContext, useState } from "react";

const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser") || null
  );

  const setUserAuth = ({ newToken, newUser }) => {
    if (newToken != null) {
      setToken(newToken);
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }

    if (newUser != null) {
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    }

    return;
  };

  return (
    <UserAuthContext.Provider value={{ token, currentUser, setUserAuth }}>
      {children}
    </UserAuthContext.Provider>
  );
};

// export default UserAuthContext;
export { UserAuthContext, UserAuthProvider };
