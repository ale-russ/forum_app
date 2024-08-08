import React from "react";

const ModalWrapper = ({ post, setShowModal, children }) => {
  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 z-50 outline-none focus:outline-none bg-gray-300 opacity-[96%] shadow-2xl">
      <div className="light-navbar flex flex-col items-center outline-none focus:outline-none light shadow-2xl w-[80%] md:w-[70%] lg:w-[35%] max-h-[70%] m-auto rounded-3xl overflow-hidden">
        <div className="w-full flex items-center justify-between px-4 my-3">
          <div className="w-full flex justify-center items-center">
            <h4 className="text-[#FF571A] font-bold">{post?.title}</h4>
          </div>
          <div
            className="flex items-center justify-center m-auto rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
            onClick={() => setShowModal(false)}
          >
            X
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
