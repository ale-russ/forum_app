import React, { useRef, useEffect } from "react";
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
  setUserTyping,
  recipient,
  userTyping,
}) => {
  const { user } = useForum();
  const chatRef = useRef(null);
  const addEmoji = (e) => {
    const emoji = e.emoji;
    setInput((prevInput) => prevInput + emoji);
  };

  useCloseModal(chatRef, () => setShowPicker(false));

  const handleTyping = () =>
    socket?.emit("typing", { userId: user._id, recipient: recipient });

  useEffect(() => {
    socket?.on("user typing", (author) => {
      if (author.userName !== user.userName) {
        setUserTyping(`${author.userName} is typing `);
      }
    });

    socket?.on("stop typing", (data) => {
      setUserTyping("");
    });
  }, []);

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
            className={`transition-all duration-300  ${
              showPicker
                ? "opacity-100 animate-slide-in-up"
                : "opacity-0 animate-slide-out-down pointer-events-none"
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
            setUserTyping("");
          } else {
            if (e.target.value.trim()) handleTyping();
            setTimeout(() => {
              socket?.emit("stop typing", {
                userId: user._id,
                recipient: recipient,
              });
            }, 100000);
          }
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
