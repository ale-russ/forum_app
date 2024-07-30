import { useContext } from "react";

import ThemeContext from "../utils/ThemeContext";

const useTheme = () => {
  return useContext(ThemeContext);
};

export default useTheme;
