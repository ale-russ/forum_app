import React, { useEffect } from "react";
import { useForum } from "../../utils/PostContext";
import ProfileImage from "./ProfileImage";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../utils/MessageContextProvider";

const DisplayContactsModal = ({ contactsModalRef, showContacts }) => {
  const navigate = useNavigate();
  const { onlineUsers, user } = useForum();
  const { userList, handleFetchUsers } = useMessage();

  useEffect(() => {
    handleFetchUsers();
  }, []);
  return (
    <div
      ref={contactsModalRef}
      className={`flex flex-col items-center z-40 w-72 fixed right-8 top-16 light rounded shadow-xl border border-gray-300 pb-3 ${
        showContacts
          ? "opacity-100 animate-slide-in-down"
          : "opacity-0 animate-slide-out-up pointer-events-none"
      }`}
    >
      <div className="p-3">
        <p className="font-bold flex justify-center items-center">Contacts</p>
      </div>
      <div className="relative flex flex-col items-start space-y-2 w-full px-2 h-full overflow-y-auto scrollbar custom-scrollbar">
        {userList
          ?.filter((usr) => usr._id !== user._id)
          .sort((a, b) => a.userName.localeCompare(b.userName))
          .map((usr) => {
            const isOnline = onlineUsers?.some(
              (onlineUser) => onlineUser.user._id === usr._id
            );

            return (
              <div
                key={usr._id}
                className="relative flex items-center border border-gray-300 rounded-lg shadow-xl p-1 h-18 w-full light-navbar cursor-pointer"
                aria-label={`Chat with ${usr.userName}`}
                onClick={() => {
                  navigate(`/chat/private-chat/${usr._id}`, {
                    state: { recipient: usr },
                  });
                }}
              >
                <ProfileImage author={usr} />
                <p>{usr.userName}</p>
                {isOnline && (
                  <div className="rounded-full border border-stone-300 h-3 w-3 bg-green-500 absolute top-2 left-9" />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DisplayContactsModal;
