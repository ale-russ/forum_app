import React, { useEffect, useRef, useState } from 'react';

import ChatTile from './ChatTile';
import JoinRoom from './JoinRoom';
import Room from './RoomComponent';
import { useSocket } from '../../utils/SocketContext';
import { useForum } from '../../utils/PostContext';
import useCloseModal from '../../hooks/useCloseModal';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [openModals, setOpenModals] = useState([]);
  const socket = useSocket();
  const { user, onlineUsers } = useForum();
  const generalChatRef = useRef(null);

  useCloseModal(generalChatRef, () => setIsOpen(false));

  useEffect(() => {
    if (socket && user) {
      socket.emit('user connected', user._id);
    }
  }, [socket, user]);

  const openChatModal = (recipient) => {
    const isAlreadyOpen = openModals.some((modal) => modal.recipient === recipient);

    if (!isAlreadyOpen) {
      const onlineRecipient = onlineUsers.find((user) => user.user._id === recipient._id);
      setOpenModals((prevModals) => [
        ...prevModals,
        {
          recipient: {
            _id: recipient._id,
            userName: recipient.userName,
            socketId: onlineRecipient ? onlineRecipient.socketId : null,
          },
          key: recipient._id,
        },
      ]);
    }
  };

  // const closeChatModal = (recipient) => {
  //   setOpenModals((prevModals) =>
  //     prevModals.filter((modal) => modal.recipient !== recipient)
  //   );
  // };

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
    <div className=" fixed bottom-24 left-5 z-50 hidden md:flex items-end">
      <div className="flex flex-col gap-y-4">
        <button
          className={`${
            isOpen ? 'visible' : 'hidden'
          } bg-blue-600 text-white h-14 w-14 rounded-full shadow-lg  transition-colors z-50 ease-in-out duration-300`}
          onClick={handleOpenCreateModal}
        >
          Create
        </button>
        <button
          className={`${
            isOpen ? 'visible' : 'hidden'
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
        {isOpen && (
          <ChatTile
            handleToggle={handleToggle}
            setIsOpen={setIsOpen}
            openChatModal={openChatModal}
            generalChatRef={generalChatRef}
          />
        )}
        {createModalOpen && <Room setCrateModalOpen={setCreateModalOpen} />}
        {joinModalOpen && <JoinRoom setJoinModalOpen={setJoinModalOpen} />}
      </div>
    </div>
  );
};

export default Chat;
