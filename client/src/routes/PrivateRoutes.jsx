import React, { useContext } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = ({ allowedRoutes }) => {
  const location = useLocation();
  const user = localStorage.getItem("token");

  return user ? (
    <Outlet replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
    //    (
    //     <Outlet replace />
    //   ) : (
    //     <Navigate to="/unauthorized" state={{ from: location }} replace />
    //   )
    // ) : (
    //   <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
