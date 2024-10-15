import React, { useEffect } from "react";

import CenterSide from "../components/CenterSide";
import { useForum } from "../utils/PostContext";

import HomeWrapper from "../components/common/HomeWrapper";
import { notifyUser } from "../controllers/PushNotificationController";

const Home = () => {
  const { handleFetchPosts, user } = useForum();
  console.log("user: ", user);

  const handleSendNotification = async () => {
    await notifyUser(
      user.userName,
      user._id,
      "New Private Message",
      `${user.userName} has sent you a private message`
    );
  };

  useEffect(() => {
    handleFetchPosts();
    handleSendNotification(); //
  }, []);

  return <HomeWrapper children={<CenterSide />} />;
};

export default Home;
