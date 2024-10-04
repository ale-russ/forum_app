import React from "react";

const TagsGroupsTile = ({ image, label, caption, color, onRoomClicked }) => {
  return (
    <section
      className="flex items-center cursor-pointer"
      onClick={onRoomClicked}
    >
      <div
        className={`${color} flex items-center justify-center h-8 w-8 rounded-lg mr-2 font-bold`}
      >
        {label[0]} R
      </div>
      <div className="flex flex-col items-start w-[75%] ">
        <p className="font-bold text-lg overflow-hidden text-ellipsis line-clamp-1">
          #{label}
        </p>
        <p className="dark-caption">{caption}</p>
      </div>
    </section>
  );
};

export default TagsGroupsTile;
