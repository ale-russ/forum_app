import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import ThemeContext from "../utils/context/ThemeContext";

const Unauthorized = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  //   const { theme } = useContext(ThemeContext);

  const goBack = () => {
    navigate(state?.previous);
  };
  return (
    <div
    // className={`${theme}`}
    >
      <div
        className={`flex flex-col justify-center items-center space-y-4 h-screen
        `}
      >
        <p className="text-3xl">Unauthorized Access!</p>

        {/* <button
          onClick={goBack}
          className={`w-36 h-10 rounded border ${
            theme === "dark" ? "dark-border" : "light-border"
          } hover:scale-105`}
        >
          Go Back
        </button> */}
      </div>
    </div>
  );
};

export default Unauthorized;
