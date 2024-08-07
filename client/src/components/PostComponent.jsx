import React, { useEffect, useRef, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";

import { useForum } from "../utils/PostContext";
import { ReactComponent as ProfileImage } from "../assets/ProfileImage.svg";
import { fetchPosts, likePost } from "../controllers/ForumController";
import { host } from "../utils/ApiRoutes";

const socket = io(host);

const PostComponent = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const { threads, setThreads, handleLikePost, handleFetchPosts } = useForum();
  const token = localStorage.getItem("token");

  const [socketComment, setSocketComment] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const commentEndRef = useRef(null);

  const scrollToBottom = () => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLocalAddComment = async (e) => {
    const content = e.target.value.trim();
    if (!content) return;

    if (commentInput.trim()) {
      const newComment = {
        postId: post._id,
        author: user.userId,
        content: commentInput,
      };
      if (newComment) socket.emit("new comment", newComment);

      setCommentInput("");
    }
  };

  useEffect(() => {
    if (post?.comments) {
      setSocketComment(post.comments);
    }
  }, [post?.comments]);

  useEffect(() => scrollToBottom, [socketComment]);

  useEffect(() => {
    socket.on("new comment", (comment) => {
      // setSocketComment((prevComments) => [...prevComments, comment]);
      setSocketComment((prevComments) => {
        const exists = prevComments.some((c) => c._id === comment._id);
        if (!exists) {
          return [...prevComments, comment];
        }
        return prevComments;
      });
    });

    return () => {
      socket.off("new comment");
    };
  }, []);

  const sortComments = (comments) => {
    return comments.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  };

  const groupedComments = (comments) => {
    let groupedComments = [];
    let currentGroup = [];

    comments.forEach((comment, index) => {
      if (
        index === 0 ||
        comment.author._id !== comments[index - 1].author._id
      ) {
        if (currentGroup > 0) {
          groupedComments.push(currentGroup);
        }

        currentGroup = [comment];
      } else {
        currentGroup.push(comment);
      }
    });

    if (currentGroup.length > 0) {
      groupedComments.push(currentGroup);
    }

    return groupedComments;
  };

  // console.log("Threads: ", socketComment);
  const sortedGroupedComments = groupedComments(sortComments(socketComment));

  // console.log("PostComponent Date: ", post?.createdAt);
  // console.log("Post: ", post);
  return (
    <div className="light-navbar flex items-start h-48 rounded-lg shadow-lg w-full py-3 px-4">
      {/* <div className="rounded-lg bg-green-500 w-52 h-full ">Image</div> */}
      <div className="flex items-start flex-col justify-between w-full h-full px-2 ">
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex items-center justify-between w-full  ">
            <div className="line-clamp-2 font-bold">
              {post?.title} : {post?.content}
            </div>
            <div
              className="hidden md:block lg:block xl:block"
              // onClick={() => likePost(post?._id, token)}
              onClick={() => handleLikePost(post)}
            >
              <CiHeart />
            </div>
            <div className="block md:hidden lg:hidden xl:hidden">
              <ProfileImage className="rounded-full h-auto object-fill " />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-lg shadow-lg text-[10px] p-2 light-search">
              tag of the first tags
            </div>
            <div className="rounded-lg shadow-lg text-[10px] p-2 light-search">
              tag3
            </div>
            <div className="rounded-lg shadow-lg text-[10px] p-2 light-search">
              tag2
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="hidden lg:flex md:flex xl:flex items-center">
            <ProfileImage className="rounded-full h-auto object-fill mr-4" />
            <div className="flex flex-col items-start">
              <div className="font-bold text-sm">{post?.author.userName}</div>
              <div className="text-[10px] text-[#48494e]">
                {/* {formatDistanceToNow(new Date(post?.createdAt))} ago */}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#48494e] w-full md:w-[50%] lg:w-[50%] xl:w-[50%]">
            <div className="flex flex-wrap items-center px-2">244,567 View</div>
            <div className="flex flex-wrap">244,567 Likes</div>
            <div
              className="flex flex-wrap items-center justify-center hover:cursor-pointer"
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              {socketComment?.length} Comments
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <div className="flex flex-col items-center fixed inset-0 z-50 outline-none focus:outline-none bg-gray-300 opacity-[96%] shadow-2xl">
          <div className="light-navbar flex flex-col items-center outline-none focus:outline-none light shadow-2xl w-[80%] md:w-[70%] lg:w-[35%] h-[70%] m-auto rounded-3xl overflow-hidden">
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

            <div className="flex flex-col items-start overflow-y-auto scrollbar custom-scrollbar mx-1 flex-grow w-full">
              {socketComment?.map((comment, index) => (
                <div
                  key={index}
                  className="flex flex-row items-start my-2 w-full"
                >
                  <div className="light-search text-[13px] rounded-lg shadow-lg py-1 px-3 ml-8 mr-5 w-[90%]">
                    {/* {comment.author._id !== user.userId && ( */}
                    <h1 className="text-sm italic font-bold">
                      {comment.author?.userName}
                    </h1>
                    {/* )} */}
                    {/* {comment.map((comment, commentIndex) => ( */}
                    <p className="w-full">{comment?.content}</p>
                    {/* ))} */}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center w-full p-4 border-t border-gray-700">
              <ProfileImage className="rounded-full object-fill mx-4" />
              <textarea
                className="flex items-center light-search h-16 px-4 focus:outline-none focus:shadow-outline outline-none border-0 rounded-lg shadow-lg w-[70%] md:w-[80%] lg:w-[80%] my-2"
                type="text"
                placeholder="Add a comment"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleLocalAddComment(e);
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostComponent;
