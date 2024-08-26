import React, { useEffect, useRef, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { useForum } from '../../utils/PostContext';
import CommentsModal from './CommentsModal';
import { host } from '../../utils/ApiRoutes';
import { updatePost, updateViewCount } from '../../controllers/ForumController';
import ProfileImage from '../common/ProfileImage';
import Loader from '../common/Loader';
import PulseAnimationLoader from '../common/PulseAnimationLoader';
import useCloseModal from '../../hooks/useCloseModal';

const socket = io(host);

const PostComponent = ({ post }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { handleLikePost, user, token, handleDeletePost, postLoading } = useForum();

  const [localPost, setLocalPost] = useState(post);
  const [likeCount, setLikeCount] = useState(localPost?.likes?.length);
  const [isLiked, setIsLiked] = useState(localPost?.likes?.includes(user._id));
  const [viewCount, setViewCount] = useState(localPost?.views.length || 0);
  const [showMenu, setShowMenu] = useState(false);
  const deleteModalRef = useRef();

  const [localCommentCount, setLocalCommentCount] = useState(localPost.comments?.length || 0);

  const handleDelete = async () => {
    await handleDeletePost(localPost);
  };

  const handleLike = async () => {
    try {
      const updatedPost = await handleLikePost(localPost._id);
      setIsLiked(updatedPost?.likes.includes(user._id));
      setLikeCount(updatedPost?.likes?.length);
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleViewPost = async () => {
    if (localPost.views.includes(user._id)) return;

    setViewCount((prevCount) => prevCount + 1);

    await updateViewCount({
      postId: localPost._id,
      token,
    });
  };

  useEffect(() => {
    const handleNewComment = ({ id }) => {
      if (id === localPost._id) {
        setLocalCommentCount((prevCount) => prevCount + 1);
      }
    };

    socket.on('new comment', handleNewComment);

    return () => {
      socket.off('new comment', handleNewComment);
    };
  }, [localPost._id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (deleteModalRef?.current && !deleteModalRef?.current?.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="light-navbar flex items-start h-48 rounded-lg shadow-lg w-full py-3 px-4">
      {postLoading ? (
        <PulseAnimationLoader />
      ) : (
        <div className="flex items-start flex-col justify-between w-full h-full px-2 ">
          <div className="flex flex-col w-full gap-y-3">
            <div className="flex items-center justify-between w-full">
              <div className="line-clamp-2 font-bold w-[90%]">
                {localPost?.title} : {localPost?.content}
              </div>
              <div className="relative flex items-center">
                <div className=" block cursor-pointer" onClick={handleLike}>
                  {isLiked ? <FaHeart className={`text-red-500`} /> : <CiHeart />}
                </div>
                <BsThreeDotsVertical className="cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
                {showMenu && (
                  <div
                    ref={deleteModalRef}
                    className="absolute top-full right-0 z-50 flex flex-col items-center w-28 p-2 space-y-2 light-search rounded-lg"
                  >
                    {/* <div className="rounded-lg light-navbar w-full p-1 light-navbar text-sm cursor-pointer">
                      Update post
                    </div> */}
                    <div className="rounded-lg light-navbar w-full p-1 cursor-pointer text-sm" onClick={handleDelete}>
                      Delete post
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-x-2 mb-3">
              {localPost?.tags &&
                localPost.tags.map((tag, index) => {
                  return (
                    <div key={index} className="rounded-lg shadow-lg text-[10px] p-2 light-search">
                      {tag}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col md:flex-row items-center w-20 md:w-[20%] ">
              <ProfileImage author={localPost?.author} />
              <div className="flex flex-col items-start">
                <div className="font-bold text-sm">{localPost?.author.userName}</div>
                <div className="text-[10px] text-[#48494e] text-ellipsis truncate">
                  {formatDistanceToNow(new Date(localPost?.createdAt))} ago
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end md:justify-between  space-x-2 md:space-x-0 mr-1 text-[10px] text-[#48494e] w-full md:w-[70%] ">
              <div className="flex items-center justify-between text-sm  w-[60%] md:w-full mx-1">
                <div className="flex flex-wrap cursor-pointer">{viewCount} View</div>
                <div className="flex flex-wrap cursor-pointer" onClick={handleLike}>
                  {likeCount} Likes
                </div>
                <div
                  className="flex flex-wrap items-center justify-center hover:cursor-pointer"
                  onClick={() => {
                    setShowModal(!showModal);
                  }}
                >
                  {localCommentCount} Comments
                </div>
              </div>
              <div
                className="primary text-white rounded-lg px-2 py-1 text-[13px] cursor-pointer"
                onClick={() => {
                  handleViewPost();
                  navigate(`/post/:${localPost._id}`, { state: { localPost } });
                }}
              >
                Read
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <CommentsModal
          setShowModal={setShowModal}
          localPost={localPost}
          setLocalPost={setLocalPost}
          localCommentCount={localCommentCount}
          setLocalCommentCount={setLocalCommentCount}
        />
      )}
    </div>
  );
};

export default PostComponent;
