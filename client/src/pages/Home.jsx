import React, { useContext, useEffect, useState } from "react";

import Nav from "../components/Nav";
import {
  addComment,
  createPost,
  fetchPosts,
} from "../controllers/ForumController";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";
import Loader from "../components/common/Loader";
import { postsRoute } from "../utils/ApiRoutes";
import NavBar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";
import CenterSide from "../components/CenterSide";
import { useForum } from "../utils/PostContext";
import Chat from "../components/chat/Chat";
import Room from "../components/chat/RoomComponent";

const Home = () => {
  const { token } = useContext(UserAuthContext);
  const { loading, handleFetchPosts } = useForum();

  useEffect(() => {
    handleFetchPosts();
  }, []);

  return (
    <div className="light">
      <NavBar />
      {loading ? (
        <Loader />
      ) : (
        <main className="flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row px-4 h-full w-full">
          <LeftSideBar />
          <CenterSide />
          <Chat />
        </main>
      )}
    </div>
  );
};

export default Home;
