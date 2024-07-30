import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] =
    useState(localStorage.getItem("userTheme")) || "light";

  useEffect(() => {
    localStorage.setItem("userTheme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("userTheme"));
    };

    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const toggleTheme = ({ newTheme }) => {
    setTheme(newTheme);
    localStorage.setItem("userTheme", theme);
    return;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// export const useTheme = () => {
//   return useContext(ThemeContext);
// };

export default ThemeContext;
