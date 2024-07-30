import React, { createContext, useEffect, useState } from "react";

export const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const setUserAuth = ({ newToken }) => {
    setToken(newToken);
    // localStorage.setItem("user", JSON.stringify(auth));
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <UserAuthContext.Provider value={{ token, setUserAuth }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContext;
