import React, { useContext } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";
import Chat from "../components/chat/Chat";
import { ForumProvider } from "../utils/PostContext";
import { SocketProvider } from "../utils/SocketContext";
import MessageContextProvider from "../utils/MessageContextProvider";
import Footer from "../components/common/Footer";

const PrivateRoutes = ({ allowedRoutes }) => {
  const location = useLocation();
  // const token = localStorage.getItem("token");
  const [token, currentUser] = allowedRoutes;

  return token && currentUser ? (
    <SocketProvider>
      <ForumProvider>
        <MessageContextProvider>
          <Navbar />
          <div className="flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row px-4 w-full overflow-x-hidden scrollbar custom-scrollbar mt-16">
            <LeftSideBar />
            <Outlet replace />
            {/* <Chat /> */}
          </div>
          {/* <Footer /> */}
        </MessageContextProvider>
      </ForumProvider>
    </SocketProvider>
  ) : (
    // <Navigate to="/" state={{ from: location }} replace />
    <Navigate to="/" />
  );
};

export default PrivateRoutes;
