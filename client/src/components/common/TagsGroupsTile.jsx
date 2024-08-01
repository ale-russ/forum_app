import React from "react";

const TagsGroupsTile = ({ image, label, caption, color }) => {
  return (
    <section className="flex items-center">
      <div
        className={`${color} flex items-center justify-center h-8 w-8 rounded-lg mr-2`}
      >
        {image}
      </div>
      <div className="flex flex-col items-start">
        <p className="font-bold text-lg">#{label}</p>
        <p className="dark-caption">{caption}</p>
      </div>
    </section>
  );
};

export default TagsGroupsTile;
