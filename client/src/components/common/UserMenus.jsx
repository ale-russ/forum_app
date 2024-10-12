import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserAuthContext } from "../../utils/UserAuthenticationProvider";
import { useForum } from "../../utils/PostContext";
import TagsGroupsTile from "./TagsGroupsTile";
import Room from "../chat/RoomComponent";
import JoinRoom from "../chat/JoinRoom";
import { useMessage } from "../../utils/MessageContextProvider";
import RoomsLoader from "./RoomsLoader";
import { handleLogout } from "../../controllers/AuthController.js";

const UserMenus = ({ userMenuRef, showDropdown }) => {
  const navigate = useNavigate();
  const { user } = useForum();
  const { handleFetchRooms, chatRooms, roomsLoading } = useMessage();
  const { setUserAuth } = useContext(UserAuthContext);
  const [showWarningModal, setShowWarningModal] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const handleRoomClick = (roomId, chatUsers) => {
    const userExists = chatUsers.users.some((usr) => usr._id === user._id);
    if (!userExists) {
      setShowWarningModal(userExists);
      return;
    }
    navigate(`/rooms/${roomId}`);
  };

  const handleOpenJoinModal = () => {
    setJoinModalOpen(!joinModalOpen);
    // handleCloseDropdownMenu();
  };
  const handleOpenCreateModal = () => {
    setCreateModalOpen(!createModalOpen);
    // handleCloseDropdownMenu();
  };

  const signOut = async () => {
    await handleLogout();
    setUserAuth({ newToken: "", newUser: null });
    navigate("/");
  };
  return (
    <div ref={userMenuRef}>
      <div
        // ref={userMenuRef}
        className={`flex flex-col items-center justify-start fixed right-4 top-16 z-40 w-56 light-navbar rounded shadow-xl border border-gray-300 ${
          showDropdown
            ? "opacity-100 animate-slide-in-down"
            : "opacity-0 animate-slide-out-up pointer-events-none"
        }`}
      >
        <div className="p-2">
          <strong>{user.userName}</strong>
        </div>
        <div className="w-full border border-gray-300 m-3" />
        <div className="flex flex-col items-start justify-center w-full gap-y-2 p-2">
          <p
            className="border border-gray-300 rounded drop-shadow-xl light-navbar w-full p-1 px-2 cursor-pointer font-semibold text-lg "
            onClick={() => {
              console.log("user: ", user);
              if (user.role === "admin") {
                navigate("/dashboard");
              } else {
                navigate("/user-profile");
              }
            }}
          >
            Profile
          </p>

          {roomsLoading ? (
            <RoomsLoader />
          ) : (
            <div className="my-2 w-full rounded border border-gray-300 shadow-xl px-1">
              <h1>Chat Rooms</h1>
              <div className="border border-b w-full border-gray-300" />
              <div className="max-h-72 overflow-y-auto scrollbar custom-scrollbar w-full py-1">
                {chatRooms &&
                  chatRooms.map((room) => (
                    <TagsGroupsTile
                      key={room._id}
                      label={room.name}
                      color="bg-[#FF8F67]"
                      caption={`${room.users.length} Users`}
                      onRoomClicked={() => handleRoomClick(room._id, room)}
                    />
                  ))}
              </div>
            </div>
          )}

          <div
            className="flex items-center border border-gray-300 rounded shadow-xl p-1 h-18 w-full light-navbar cursor-pointer "
            onClick={handleOpenCreateModal}
          >
            Create Chat Room
          </div>
          <div
            className="flex items-center border border-gray-300 rounded shadow-xl p-1 h-18 w-full light-navbar cursor-pointer "
            onClick={handleOpenJoinModal}
          >
            Join Chat Room
          </div>
          <button
            className="bg-red-600 text-white rounded p-1 text-sm mt-3"
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
      {createModalOpen && <Room setCrateModalOpen={setCreateModalOpen} />}
      {joinModalOpen && <JoinRoom setJoinModalOpen={setJoinModalOpen} />}
    </div>
  );
};

export default UserMenus;
