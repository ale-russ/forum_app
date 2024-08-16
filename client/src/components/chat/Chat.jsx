import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import ChatTile from "./ChatTile";
import JoinRoom from "./JoinRoom";
import Room from "./RoomComponent";
import PrivateChat from "./PrivateChat";
import { host } from "../../utils/ApiRoutes";

const socket = io(host);

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [activePrivateChat, setActivePrivateChat] = useState(null);

  const [openModals, setOpenModals] = useState([]);

  const openChatModal = (recipient) => {
    // console.log("REcipient: ", recipient);
    console.log("recipient in chat", recipient);
    const isAlreadyOpen = openModals.some(
      (modal) => modal.recipient === recipient
    );

    if (!isAlreadyOpen) {
      setOpenModals([{ recipient }]);
    }
  };

  const closeChatModal = (recipient) => {
    setOpenModals((prevModals) =>
      prevModals.filter((modal) => modal.recipient !== recipient)
    );
  };

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

  const startPrivateChat = (user) => {
    setActivePrivateChat(user);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

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
      <div className="flex items-center">
        <div className="fixed bottom-24 right-20 z-50">
          {isOpen && (
            <ChatTile
              handleToggle={handleToggle}
              setIsOpen={setIsOpen}
              openChatModal={openChatModal}
            />
          )}
          {createModalOpen && <Room setCrateModalOpen={setCreateModalOpen} />}
          {joinModalOpen && <JoinRoom setJoinModalOpen={setJoinModalOpen} />}
        </div>
        {openModals.map(({ recipient }) => (
          <PrivateChat
            key={recipient._id}
            recipient={recipient}
            onClose={() => closeChatModal(recipient)}
          />
        ))}
      </div>
    </div>
  );
};

export default Chat;
