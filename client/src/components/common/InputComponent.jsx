import React, { useRef } from "react";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { useForum } from "../../utils/PostContext";
import useCloseModal from "../../hooks/useCloseModal";

export const InputComponent = ({
  setInput,
  setShowPicker,
  showPicker,
  handleSendMessage,
  input,
  socket,
}) => {
  const { user } = useForum();
  const chatRef = useRef(null);
  const addEmoji = (e) => {
    const emoji = e.emoji;
    setInput((prevInput) => prevInput + emoji);
  };

  useCloseModal(chatRef, () => setShowPicker(false));

  const handleTyping = () =>
    socket.emit("typing", `${user.userName} is typing`);

  return (
    <div className=" relative flex items-center light-search  h-12 pl-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg m-4">
      <span
        className="cursor-pointer m-auto hover:text-[#FF571A] mr-1"
        onClick={() => setShowPicker((val) => !val)}
      >
        <BsEmojiSmile />
      </span>
      {showPicker && (
        <div ref={chatRef} className="absolute bottom-full left-0 mb-2">
          <Picker
            height={350}
            width={300}
            onEmojiClick={addEmoji}
            className={` transition ease-in-out duration-300 ${
              showPicker ? "open-animation" : "close-animation"
            }`}
          />
        </div>
      )}
      <input
        type="text"
        className="w-full light-search h-full focus:outline-none focus:shadow-outline outline-none border-0 mr-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
          //  else {
          //   if (e.target.value.trim()) handleTyping();
          //   setTimeout(() => {
          //     socket.emit("stopTyping");
          //   }, 5000);
          // }
        }}
      />
      <button className="bg-[#FF571A] text-white p-2 rounded-r-lg h-full">
        <IoMdSend
          className="w-4 h-4 cursor-pointer text-white "
          onClick={handleSendMessage}
        />
      </button>
    </div>
  );
};
