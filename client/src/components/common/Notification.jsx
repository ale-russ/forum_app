import React, { useState, useEffect } from "react";
import { TbBellFilled } from "react-icons/tb";

import { useMessage } from "../../utils/MessageContextProvider";

const Notification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const {
    newMessages,
    hasUnreadMessages,
    setHasUnreadMessages,
    navigateToChat,
    setNotifications,
  } = useMessage();

  useEffect(() => {
    if (showNotification) {
      setHasUnreadMessages(false);
    }
  }, [showNotification]);
  return (
    <>
      <div
        className=" relative  flex items-center mx-auto rounded-lg light-search cursor-pointer"
        onClick={() => {
          setShowNotification(!showNotification);
        }}
      >
        <TbBellFilled className="w-9 h-9  px-2  rounded-lg" />
        {hasUnreadMessages && (
          <div className="absolute top-2 right-2 rounded-full h-2 w-2 bg-red-600" />
        )}
      </div>
      {showNotification ? (
        <div
          className={`flex flex-col items-center justify-start fixed right-4 top-16 z-40 w-72 min-h-16 max-h-72 light-navbar rounded shadow-xl border border-gray-300 overflow-x-hidden overflow-y-auto scrollbar custom-scrollbar ${
            showNotification
              ? "opacity-100 animate-slide-in-down"
              : "opacity-0 animate-slide-out-up pointer-events-none"
          }`}
        >
          {newMessages?.length > 0 ? (
            newMessages?.map((message, index) => {
              return (
                <div
                  onClick={() => {
                    if (!message?.isPost) {
                      navigateToChat(message?.author);
                    } else {
                      navigate(`/post/:${message?.message?._id}`, {
                        state: { post: message?.message },
                      });
                      setNotifications({});
                    }
                  }}
                  key={index}
                  className="flex items-center rounded-lg shadow-lg border-gray-300 my-2  w-[95%] px-2 h-8 light-search text-ellipsis truncate text-sm"
                >
                  <p className="italic">
                    {message?.userName
                      ? message?.userName
                      : message?.author?.userName}{" "}
                    :
                  </p>

                  <div className="mx-2 text-ellipsis">
                    {message?.userName ? (
                      <p>has sent you a message</p>
                    ) : (
                      <p>has posted a new post</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="italic h-6 w-full m-auto text-center">
              No new notifications
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Notification;
