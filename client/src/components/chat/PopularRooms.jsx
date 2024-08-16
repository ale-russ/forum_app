import React, { useEffect, useState } from "react";
import { IoLogoJavascript } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import LeftSideWrapper from "../common/LeftSideWrapper";
import TagsGroupsTile from "../common/TagsGroupsTile";
import { useForum } from "../../utils/PostContext";

const PopularRooms = () => {
  const navigate = useNavigate();
  const { handleFetchRooms, chatRooms } = useForum();

  const getRooms = async () => {
    await handleFetchRooms();
    // setChatRooms(rooms);
  };

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  useEffect(() => {
    getRooms();
  }, [chatRooms]);

  return (
    <LeftSideWrapper
      children={
        <div>
          <h1>Chat Rooms</h1>
          {chatRooms &&
            chatRooms.map((room) => (
              <TagsGroupsTile
                key={room._id}
                image={<IoLogoJavascript />}
                label={room.name}
                color="bg-[#FF8F67]"
                caption={`${room.users.length} Users`}
                onRoomClicked={() => handleRoomClick(room._id)}
              />
            ))}
        </div>
      }
    />
  );
};

export default PopularRooms;
