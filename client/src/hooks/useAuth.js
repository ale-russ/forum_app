import { useContext } from "react";

import UserRoleContext from "../utils/context/UserRoleProvider";

const useAuth = () => {
  return useContext(UserRoleContext);
};

export default useAuth;
