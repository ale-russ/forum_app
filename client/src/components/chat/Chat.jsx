import React, { useEffect, useRef, useState } from "react";

import ChatTile from "./ChatTile";
import JoinRoom from "./JoinRoom";
import Room from "./RoomComponent";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenJoinModal = () => {
    setJoinModalOpen(true);
    setIsOpen(false);
  };
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-5 z-50 flex items-center">
      <div className="flex flex-col gap-y-4">
        <button
          className={`${
            isOpen ? "visible" : "hidden"
          } bg-blue-600 text-white h-14 w-14 rounded-full shadow-lg  transition-colors z-50 ease-in-out duration-300`}
          onClick={handleOpenCreateModal}
        >
          Create
        </button>
        <button
          className={`${
            isOpen ? "visible" : "hidden"
          } bg-zinc-800 text-white h-14 w-14 rounded-full shadow-lg transition-colors z-50 ease-in-out duration-300`}
          onClick={handleOpenJoinModal}
        >
          Join
        </button>
        <button
          className="bg-[#FF571A] text-white h-14 w-14 rounded-full shadow-lg ease-in duration-300 z-50"
          onClick={handleToggle}
        >
          Chat
        </button>
      </div>
      <div className="fixed bottom-24 right-20 z-50">
        {isOpen && (
          <ChatTile handleToggle={handleToggle} setIsOpen={setIsOpen} />
        )}
        {createModalOpen && <Room setCrateModalOpen={setCreateModalOpen} />}
        {joinModalOpen && <JoinRoom setJoinModalOpen={setJoinModalOpen} />}
      </div>
    </div>
  );
};

export default Chat;
