import React, { useEffect } from "react";

import CenterSide from "../components/CenterSide";
import { useForum } from "../utils/PostContext";

import HomeWrapper from "../components/common/HomeWrapper";

const Home = () => {
  const { handleFetchPosts } = useForum();

  useEffect(() => {
    handleFetchPosts();
  }, [handleFetchPosts]);

  return <HomeWrapper children={<CenterSide />} />;
};

export default Home;
