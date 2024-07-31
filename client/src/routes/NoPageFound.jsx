import React, { useContext } from "react";
// import ThemeContext from "../utils/context/ThemeContext";

const NoPageFound = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
    //  className={`${theme}`}
    >
      <div
        className={`flex flex-col justify-center items-center space-y-4 h-screen ${
          theme === "dark"
            ? "dark-auth-card dark-border"
            : "light-auth-card light-border"
        }`}
      >
        <p className="text-3xl"> No Page Found!</p>
      </div>
    </div>
  );
};

export default NoPageFound;
