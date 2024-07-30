import useTheme from "../hooks/useTheme";

// const getTheme = () => {
//   const { theme } = useTheme();
//   return theme;
// };

const toastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  // theme: "light",
  // theme: getTheme() === "dark" ? "dark" : "light",
};

export default toastOptions;
