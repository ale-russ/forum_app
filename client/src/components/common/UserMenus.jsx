import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoLogoJavascript } from "react-icons/io";

import { UserAuthContext } from "../../utils/UserAuthenticationProvider";
import { useForum } from "../../utils/PostContext";
import TagsGroupsTile from "./TagsGroupsTile";
import { handleLogout } from "../../controllers/AuthController";

const UserMenus = ({ userMenuRef }) => {
  const navigate = useNavigate();
  const { user, handleFetchRooms, chatRooms } = useForum();
  const { setUserAuth } = useContext(UserAuthContext);
  const [showWarningModal, setShowWarningModal] = useState(true);

  useEffect(() => {
    getRooms();
  }, [chatRooms]);

  const getRooms = async () => {
    await handleFetchRooms();
  };

  const handleRoomClick = (roomId, chatUsers) => {
    const userExists = chatUsers.users.some((usr) => usr._id === user._id);
    if (!userExists) {
      setShowWarningModal(userExists);
      return;
    }
    navigate(`/rooms/${roomId}`);
  };

  const signOut = async () => {
    await handleLogout({ navigate });
    setUserAuth({ newToken: "" });
    navigate("/");
  };
  return (
    <>
      <div
        ref={userMenuRef}
        className="flex flex-col items-center justify-start fixed right-4 top-16 z-40 w-56 light-navbar rounded shadow-xl border border-gray-300"
      >
        <div className="p-2">
          <strong>{user.userName}</strong>
        </div>
        <div className="w-full border border-gray-300 m-3" />
        <div className="flex flex-col items-start justify-center w-full gap-y-2 p-2">
          <p
            className="border border-gray-300 rounded-sm drop-shadow-xl light-search opacity-65 w-full p-1 cursor-pointer "
            onClick={() => navigate("/user-profile")}
          >
            Profile
          </p>
          <div className="my-2">
            <h1>Chat Rooms</h1>
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
          <button
            className="bg-red-600 text-white rounded-lg px-1 text-sm"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      </div>
      {!showWarningModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 inset-0 w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-50">
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

export default UserMenus;
