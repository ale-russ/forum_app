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

function App() {
  const { token } = useContext(UserAuthContext);

  return (
    <div className="light h-full w-full overflow-x-hidden">
      <ForumProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthWrapper />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<PrivateRoutes allowedRoutes={[token]} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/rooms/:roomId" element={<ChatRoom />} />
              <Route path="/:id/replies" element={<Replies />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/user-profile" element={<ProfilePage />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/not-found" element={<NoPageFound />} />
          </Routes>
        </BrowserRouter>
      </ForumProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
