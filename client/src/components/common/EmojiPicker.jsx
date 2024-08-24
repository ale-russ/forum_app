import React from "react";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const EmojiPickerComponent = ({
  pickerRef,
  setInput,
  showPicker,
  setShowPicker,
}) => {
  const addEmoji = (e) => {
    const emoji = e.emoji;
    setInput((prevInput) => prevInput + emoji);
  };
  return (
    <>
      <span
        className="cursor-pointer m-auto hover:text-[#FF571A] mr-1"
        onClick={() => setShowPicker((val) => !val)}
      >
        <BsEmojiSmile />
      </span>
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mb-2 z-50 inset-auto"
        >
          <Picker
            height={350}
            width={300}
            onEmojiClick={addEmoji}
            className={`h-24 transition ease-in-out duration-300 ${
              showPicker ? "open-animation" : "close-animation"
            }`}
          />
        </div>
      )}
    </>
  );
};

export default EmojiPickerComponent;
