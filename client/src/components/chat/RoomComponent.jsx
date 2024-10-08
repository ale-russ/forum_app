import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";

import { host } from "../../utils/ApiRoutes";
import ModalWrapper from "../common/ModalWrapper";
import { toastOptions } from "../../utils/constants";
import { useForum } from "../../utils/PostContext";
import { useMessage } from "../../utils/MessageContextProvider";

const socket = io(host);
const Room = ({ setCrateModalOpen }) => {
  const [roomName, setRoomName] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const { user } = useForum();
  const { chatRooms, setChatRooms } = useMessage();

  const userId = user._id;

  const handleCreateRoom = () => {
    if (roomName === "")
      return toast.error("Please Give Room Name", toastOptions);

    if (roomName.trim()) {
      socket.emit("create room", { roomName, userId });
      setCurrentRoom(roomName);
      setRoomName("");
    }
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socket.emit("leave room", currentRoom);
      setCurrentRoom(null);
    }
  };

  const handleJoinRoom = (room) => {
    socket.emit("join room", room);
    setCurrentRoom(room);
  };

  useEffect(() => {
    socket.on("create room", (room) => {
      if (room._id) {
        toast.success("Room created successfully", toastOptions);
        setRooms([...rooms, room]);
        setChatRooms([...chatRooms, room]);
        setCurrentRoom(room);
        setRoomName("");
      }
    });

    socket.on("user joined", ({ userId, roomName }) => {
      setRooms((prevRooms) => {
        prevRooms.map((room) =>
          room.name === roomName
            ? { ...room, users: [...room.users, userId] }
            : room
        );
      });
    });

    socket.on("user left", (userId) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.name === roomName
            ? { ...room, users: room.users.filter((user) => user !== userId) }
            : room
        )
      );
    });

    socket.on("rooms updated", (rooms) => {
      setRooms(rooms);
    });

    socket.on("error", (error) => {
      console.error(error);
      toast.error(error, toastOptions);
    });

    return () => {
      socket.off("user joined");
      socket.off("user left");
      socket.off("room created");
      socket.off("error");
    };
  }, []);

  return (
    <ModalWrapper
      setShowModal={setCrateModalOpen}
      children={
        <div className="light-navbar h-full w-full">
          <div className="flex flex-col items-center gap-x-4  w-full px-4">
            <div className="flex flex-col gap-y-4 w-full md:w-[70%] ">
              <p className="text-center">Create A Room</p>
              <input
                type="text"
                className="light-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg"
                placeholder="Set the Room's name"
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
              />
            </div>
            <button
              className="rounded bg-[#FF571A] h-10 w-40 text-sm px-3 my-5 shadow-lg text-white drop-shadow-lg"
              onClick={handleCreateRoom}
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateRoom();
                }
              }}
            >
              Create
            </button>
          </div>
          <ToastContainer />
        </div>
      }
    />
  );
};

export default Room;
