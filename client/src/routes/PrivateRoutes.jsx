import React, { useContext } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";

const PrivateRoutes = ({ allowedRoutes }) => {
  const location = useLocation();
  const user = localStorage.getItem("token");

  return user ? (
    <>
      <Navbar />
      <div className="flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row px-4 h-full w-full">
        <LeftSideBar />
        <Outlet replace />
      </div>
    </>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
