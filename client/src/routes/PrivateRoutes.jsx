import React, { useContext } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";
import Chat from "../components/chat/Chat";
import { ForumProvider } from "../utils/PostContext";
import { SocketProvider } from "../utils/SocketContext";
import MessageContextProvider from "../utils/MessageContextProvider";

const PrivateRoutes = ({ allowedRoutes }) => {
  const location = useLocation();
  const user = localStorage.getItem("token");

  return user ? (
    <SocketProvider>
      <ForumProvider>
        <MessageContextProvider>
          <Navbar />
          <div className="flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row px-4 w-full">
            <LeftSideBar />
            <Outlet replace />
            {/* <Chat /> */}
          </div>
        </MessageContextProvider>
      </ForumProvider>
    </SocketProvider>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
