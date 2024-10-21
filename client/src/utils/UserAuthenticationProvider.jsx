import React, { createContext, useState } from "react";

const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser") || null
  );

  const setUserAuth = ({ newToken, newUser }) => {
    if (newToken != null && newUser != null) {
      setToken(newToken);
      setCurrentUser(newUser);
      localStorage.setItem("token", newToken);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    }

    console.log(`currentUser: ${currentUser}, token: ${token}`);

    // if (newUser != null) {
    //   setCurrentUser(newUser);
    //   localStorage.setItem("currentUser", JSON.stringify(newUser));
    // }

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
