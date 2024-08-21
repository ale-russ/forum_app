import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";

import { host } from "../../utils/ApiRoutes";
import toastOptions from "../../utils/constants";
import Loader from "./../common/Loader";
import ModalWrapper from "../common/ModalWrapper";
import { useForum } from "../../utils/PostContext";
const socket = io(host);

const JoinRoom = ({ setJoinModalOpen }) => {
  const { chatRooms, handleFetchRooms } = useForum();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleJoinRoom = () => {
    setLoading(true);

    try {
      if (selectedRoom === "") {
        toast.error("Please Select Room", toastOptions);
        return;
      }

      if (selectedRoom !== "" || selectedRoom === "Join Room") {
        socket.emit("join chat room", {
          roomId: selectedRoom,
          userId: user._id,
        });
      }
      toast.success("You have successfully joined the room", toastOptions);
    } catch (err) {
      toast.error(err, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchRooms();
    socket.on("join chat room", (message) => {
      toast.success("User has been added to group", toastOptions);
    });

    socket.on("error", (error) => {
      toast.error(error, toastOptions);
    });

    return () => {
      socket.off("join chat room");
      socket.off("error");
    };
  }, []);

  return (
    <ModalWrapper
      setShowModal={setJoinModalOpen}
      children={
        <div className="light-navbar flex flex-col h-96 w-full px-4 mx-auto">
          {loading ? (
            <Loader />
          ) : (
            <>
              <label className="px-3 mr-4 flex items-start justify-center flex-grow">
                <select
                  name="join-rooms"
                  defaultValue="Join Room"
                  value={selectedRoom}
                  onChange={(event) => setSelectedRoom(event.target.value)}
                  className="light-search rounded p-2 ml-4 w-96 outline-none selection:bg-red-800"
                >
                  <option value="Join Room">Join Room</option>
                  {chatRooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="mb-8 rounded-lg bg-[#FF571A] w-30 mx-auto p-3 text-white"
                onClick={handleJoinRoom}
              >
                Join Room
              </button>
            </>
          )}
          <ToastContainer />
        </div>
      }
    />
  );
};

export default JoinRoom;
