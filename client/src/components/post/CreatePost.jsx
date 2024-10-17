import React, { useState, useEffect, useRef } from "react";

import { useForum } from "../../utils/PostContext";
import ProfileImage from "../common/ProfileImage";
import useCloseModal from "../../hooks/useCloseModal";
import CreatePostModal from "./CreatePostModal";

const CreatePost = () => {
  const { user } = useForum();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up on unmount to restore the scroll behavior
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  useCloseModal(modalRef, () => setShowModal(false));

  return (
    <div className="light-navbar flex items-start md:items-center lg:items-center xl:items-center rounded-lg px-4 w-full py-4 drop-shadow-lg z-40">
      <ProfileImage author={user} />
      <div className="flex items-center gap-x-4  w-[90%]">
        <button
          className="rounded bg-[#FF571A] h-10 text-sm px-3 shadow-lg text-white drop-shadow-lg w-full"
          // onClick={handleCreatePost}
          onClick={(e) => {
            e.preventDefault();
            setShowModal(!showModal);
          }}
        >
          Create Post
        </button>
      </div>
      {showModal && (
        <CreatePostModal setShowModal={setShowModal} modalRef={modalRef} />
      )}
    </div>
  );
};

export default CreatePost;
