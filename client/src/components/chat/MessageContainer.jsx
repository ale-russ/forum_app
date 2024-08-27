import React from "react";
import { formatDistanceToNow, isValid } from "date-fns";

import { useForum } from "../../utils/PostContext";

export function messageContainer(messages, user) {
  //   console.log("message: ", messages);
  return ({ index, style }) => {
    const msg = messages[index];

    return (
      <div style={style}>
        <div className="w-full p-4 flex flex-col justify-between light-navbar overflow-y-auto space-y-2 scrollbar custom-scrollbar ">
          <div
            key={index}
            className={`flex flex-col ${
              msg.author._id === user._id ? "items-end" : "items-start"
            }`}
          >
            {msg.author._id !== user._id && (
              <p className="text-xs italic mb-1">{msg.author.userName}</p>
            )}
            <div
              className={` rounded-lg shadow-xl border-gray-200 min-w-10 max-w-40 flex
               ${
                 msg.author._id === user._id
                   ? "bg-blue-600 text-right"
                   : "bg-zinc-600 text-left"
               }`}
            >
              <span
                className={`inline-block px-1 py-1 rounded-lg text-[12px] ${
                  msg.author._id === user._id
                } ? "bg-blue-500 text-white" : "bg-gray-200 text-white`}
              >
                {msg.content}
              </span>
            </div>
            <p className="text-[10px] italic">
              {/* {formatDistanceToNow(msg?.createdAt)} ago */}
              {isValid(new Date(msg?.createdAt))
                ? `${formatDistanceToNow(new Date(msg?.createdAt))} ago`
                : "Just now"}
            </p>
          </div>
        </div>
      </div>
    );
  };
}
