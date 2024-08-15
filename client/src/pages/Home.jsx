import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

import Nav from "../components/Nav";
import {
  addComment,
  createPost,
  fetchPosts,
} from "../controllers/ForumController";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";
import Loader from "../components/common/Loader";
import { host, postsRoute } from "../utils/ApiRoutes";
import NavBar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";
import CenterSide from "../components/CenterSide";
import { useForum } from "../utils/PostContext";
import Chat from "../components/chat/Chat";
import Room from "../components/chat/RoomComponent";
import HomeWrapper from "../components/common/HomeWrapper";

const socket = io(host);

const Home = () => {
  const { loading, handleFetchPosts } = useForum();

  useEffect(() => {
    handleFetchPosts();
  }, []);

  return (
    <HomeWrapper
      children={
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              <CenterSide />
              <Chat />
            </>
          )}
        </>
      }
    />
  );
};

export default Home;
