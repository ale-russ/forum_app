import React, { useEffect } from "react";
import { useForum } from "../../utils/PostContext";
import ProfileImage from "./ProfileImage";
import { useNavigate } from "react-router-dom";

const DisplayContactsModal = ({ contactsModalRef }) => {
  const navigate = useNavigate();
  const { onlineUsers, userList, handleFetchUsers, user } = useForum();

  useEffect(() => {
    handleFetchUsers();
  }, []);
  return (
    <div
      ref={contactsModalRef}
      className="flex flex-col items-center z-40 w-72 fixed right-8 top-16 light rounded shadow-xl border border-gray-300 pb-3"
    >
      <div className="p-3">
        <p className="font-bold flex justify-center items-center">Contacts</p>
      </div>
      <div className="relative flex flex-col items-start space-y-2 w-full px-2 h-full overflow-y-auto scrollbar custom-scrollbar">
        {userList
          ?.filter((usr) => usr._id !== user._id)
          .map((usr) => {
            const isOnline = onlineUsers?.some(
              (onlineUser) => onlineUser.user._id === usr._id
            );
            return (
              <div
                key={usr._id}
                className="flex items-center border border-gray-300 rounded-lg shadow-xl p-1 h-18 w-full light-navbar "
                onClick={() => {
                  navigate(`/chat/private-chat/${usr._id}`, {
                    state: { recipient: usr },
                  });
                }}
              >
                <ProfileImage author={usr} />
                <p>{usr.userName}</p>
                {isOnline && (
                  <div className="rounded-full h-3 w-3 bg-green-500 absolute top-1 left-10" />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DisplayContactsModal;
