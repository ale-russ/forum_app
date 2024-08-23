import React, { useState, useEffect } from "react";

import { useForum } from "../../utils/PostContext";
import ProfileImage from "../common/ProfileImage";

const CreatePost = () => {
  const { user } = useForum();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="light-navbar flex items-start md:items-center lg:items-center xl:items-center rounded-lg px-4 w-full py-4 drop-shadow-lg">
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
      {showModal && <CreatePostModal setShowModal={setShowModal} />}
    </div>
  );
};

export default CreatePost;

const CreatePostModal = ({ setShowModal }) => {
  const { newPost, setNewPost, handleCreatePost, user } = useForum();
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState();

  const tagLists = [
    "Travel",
    "Arts",
    "Culture",
    "Politics",
    "Technology",
    "Artificial Intelligence",
    "Programming",
    "Sports",
    "Other",
  ];

  const handleSubmit = () => {
    e.preventDefault();

    if (newPost.title === "" || newPost.content === "") {
      toast.error("Title and Content cannot be empty", toastOptions);
      return;
    }

    setNewPost({
      ...newPost,
      tags: tags,
      image: image,
    });

    handleCreatePost();
  };

  useEffect(() => {
    console.log("Tags: ", tags);
  }, [tags]);

  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 z-50 outline-none focus:outline-none bg-gray-300 opacity-[96%] shadow-2xl h-[100vh]">
      <div className="light-navbar flex flex-col items-center outline-none focus:outline-none light shadow-2xl w-full lg:w-[70%] h-[70%] m-auto rounded-3xl overflow-hidden">
        <div className="w-full flex items-center justify-between px-4 my-3">
          <div className="w-full flex justify-center items-center">
            <h4 className="text-[#ceb5ad] font-bold">Create Post</h4>
          </div>
          <div
            className="flex items-center justify-center m-auto rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
            onClick={() => setShowModal(false)}
          >
            X
          </div>
        </div>
        <div className=" flex flex-col items-center md:items-center lg:items-center xl:items-center rounded-lg px-4 w-full py-4 drop-shadow-lg space-y-4">
          <img
            src={user.profileImage}
            className="mr-2 h-10 w-10 rounded-full border border-stone-600 border-opacity-30 object-fill"
            alt="User Profile"
          />
          <div className="flex flex-col px-2 py-8 items-center gap-x-4 w-full space-y-4 border border-gray-300 rounded-lg shadow-xl">
            <div className="flex flex-col gap-y-4 w-full">
              <input
                type="text"
                className="light-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg"
                placeholder="Title"
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <textarea
                type="text"
                className="flex items-center light-search  h-9 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg"
                placeholder="What's on your mind?"
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              />

              {/* <UploadImage setImage={setImage} /> */}
              {/* <PostTags setTags={setTags} tags={tags} /> */}
              <div className="flex flex-wrap items-center gap-x-2">
                {tagLists.map((tag, index) => (
                  <div key={index}>
                    <input
                      className="mr-2 cursor-pointer"
                      type="checkbox"
                      name={tag}
                      value={tag}
                      checked={tags.includes(tag)}
                      onChange={(e) => {
                        const updatedTags = e.target.checked
                          ? [...tags, tag]
                          : tags.filter((t) => t !== tag);
                        setTags(updatedTags);
                        setNewPost({ ...newPost, tags: updatedTags });
                      }}
                    />
                    <label htmlFor={tag}>{tag}</label>
                  </div>
                ))}
              </div>
              <button
                className="rounded bg-[#FF571A] h-10 text-sm px-3 my-2 mx-auto shadow-lg text-white drop-shadow-lg w-28"
                // onClick={handleCreatePost}
                onClick={handleCreatePost}
              >
                Create Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const PostTags = ({ setTags, tags }) => {
//   const tagLists = [
//     'Travel',
//     'Arts',
//     'Culture',
//     'Politics',
//     'Technology',
//     'Artificial Intelligence',
//     'Programming',
//     'Sports',
//     'Other',
//   ];

//   const handleCheckbox = (e) => {
//     const checkedTag = e.target.value;
//     setTags((prevTags) => {
//       const isExistingTag = prevTags.includes(checkedTag);

//       if (isExistingTag) {
//         return prevTags.filter((tag) => tag !== checkedTag);
//       } else {
//         return [...prevTags, checkedTag];
//       }
//     });
//   };

//   useEffect(() => {
//     console.log('Tags: ', tags);
//   }, [tags]);

//   return (
//     <div className="flex flex-wrap items-center gap-x-2">
//       {tagLists.map((tag, index) => (
//         <div key={index}>
//           <input
//             className="mr-2 cursor-pointer"
//             type="checkbox"
//             name={tag}
//             value={tag}
//             checked={tags.includes(tag)}
//             onChange={handleCheckbox}
//           />
//           <label htmlFor={tag}>{tag}</label>
//         </div>
//       ))}
//     </div>
//   );
// };
