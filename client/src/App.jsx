import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Replies from "./components/Replies";
import AuthWrapper from "./pages/AuthWrapper";
import PrivateRoutes from "./routes/PrivateRoutes";
import Unauthorized from "./routes/Unauthorized";
import NoPageFound from "./routes/NoPageFound";
import { UserAuthContext } from "./utils/UserAuthenticationProvider";
import { ForumProvider } from "./utils/PostContext";
import ChatRoom from "./pages/ChatRoom";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import { SocketProvider } from "./utils/SocketContext";
import PrivateChatPage from "./pages/PrivateChatPage";
import NewPosts from "./components/post/NewPosts";
import PopularPosts from "./components/post/PopularPosts";
import FollowingPosts from "./components/post/FollowingPosts";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import PasswordResetPage from "./pages/PasswordResetPage";
import AdminDashboard from "./pages/AdminDashboard";
import { subscribeUser } from "./controllers/PushNotificationController";

function App() {
  const { token, currentUser } = useContext(UserAuthContext);

  // const curUser = JSON.parse(currentUser);
  const curUser = currentUser;

  useEffect(() => {
    const askNotificationPermission = async () => {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        if (!curUser) {
          return;
        }
        subscribeUser(curUser?._id);
      } else {
        throw new Error("Notification permission not granted");
      }
    };

    askNotificationPermission();
  }, []);

  return (
    <div className="light w-full h-full overflow-x-hidden scrollbar custom-scrollbar">
      <BrowserRouter>
        <Routes>
          <Route element={<AuthWrapper />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/request-password-reset"
              element={<RequestPasswordReset />}
            />
            <Route path="/reset-password" element={<PasswordResetPage />} />
          </Route>
          <Route
            element={<PrivateRoutes allowedRoutes={[token, currentUser]} />}
          >
            <Route path="/home" element={<Home />} />
            <Route path="/rooms/:roomId" element={<ChatRoom />} />
            <Route path="/:id/replies" element={<Replies />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/user-profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route
              path="/chat/private-chat/:userId"
              element={<PrivateChatPage />}
            />
            <Route path="/post/latest-posts" element={<NewPosts />} />
            <Route path="/post/popular-posts" element={<PopularPosts />} />
            <Route path="/post/following-posts" element={<FollowingPosts />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/not-found" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
