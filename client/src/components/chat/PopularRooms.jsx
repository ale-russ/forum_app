import React, { useEffect, useState } from "react";
import { IoLogoJavascript } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import LeftSideWrapper from "../common/LeftSideWrapper";
import TagsGroupsTile from "../common/TagsGroupsTile";
import { useForum } from "../../utils/PostContext";

const PopularRooms = () => {
  const navigate = useNavigate();
  const { handleFetchRooms, chatRooms, user } = useForum();
  const [showWarningModal, setShowWarningModal] = useState(true);

  const getRooms = async () => {
    await handleFetchRooms();
    // setChatRooms(rooms);
  };

  const handleRoomClick = (roomId, chatUsers) => {
    const userExists = chatUsers.users.some((usr) => usr._id === user._id);
    if (!userExists) {
      setShowWarningModal(userExists);
      return;
    }
    navigate(`/rooms/${roomId}`);
  };

  useEffect(() => {
    getRooms();
  }, [chatRooms]);

  return (
    <>
      <LeftSideWrapper
        children={
          <div className="flex flex-col gap-0 w-full">
            <h1>Chat Rooms</h1>
            <div className="border border-b w-full border-gray-300" />
            <div className="max-h-72 overflow-y-auto scrollbar custom-scrollbar w-full py-1">
              {chatRooms &&
                chatRooms.map((room) => (
                  <TagsGroupsTile
                    key={room._id}
                    image={<IoLogoJavascript />}
                    label={room.name}
                    color="bg-[#FF8F67]"
                    caption={`${room.users.length} Users`}
                    onRoomClicked={() => handleRoomClick(room._id, room)}
                  />
                ))}
            </div>
          </div>
        }
      />
      {!showWarningModal && (
        <div className="absolute inset-0 w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-md bg-white rounded-lg p-6 text-center">
            <h3 className="text-gray-700 text-xl mb-4">
              Warning! Please Join the Chat Room first by pressing the Chat
              button then the Join Button.
            </h3>
            <button
              className="mb-4 rounded-lg bg-[#FF571A] w-30 p-3 text-white"
              onClick={() => setShowWarningModal(!showWarningModal)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopularRooms;
