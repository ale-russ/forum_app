// import React, { createContext, useEffect, useState } from "react";

// export const UserAuthContext = createContext(null);

// export const UserAuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   const setUserAuth = ({ newToken }) => {
//     if (newToken != null) {
//       setToken(newToken);

//       localStorage.setItem("token", newToken);
//     }
//     return;
//   };

//   return (
//     <UserAuthContext.Provider value={{ token, setUserAuth }}>
//       {children}
//     </UserAuthContext.Provider>
//   );
// };

// export default UserAuthContext;

import React, { createContext, useState } from "react";

const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const setUserAuth = ({ newToken }) => {
    console.log("newToken: ", newToken);
    if (newToken != null) {
      setToken(newToken);
      localStorage.setItem("token", newToken);
    }
  };

  return (
    <UserAuthContext.Provider value={{ token, setUserAuth }}>
      {children}
    </UserAuthContext.Provider>
  );
};

// export default UserAuthContext;
export { UserAuthContext, UserAuthProvider };
