import React, { useContext } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";
import Chat from "../components/chat/Chat";

const PrivateRoutes = ({ allowedRoutes }) => {
  const location = useLocation();
  const user = localStorage.getItem("token");

  return user ? (
    <>
      <Navbar />
      <div className="flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row px-4 h-full w-full">
        <LeftSideBar />
        <Outlet replace />
        <Chat />
      </div>
    </>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
