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

const socket = io(host);

const PostComponent = ({ post }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { handleLikePost, user, token, handleDeletePost, postLoading } = useForum();
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user._id));
  const [viewCount, setViewCount] = useState(post.views.length || 0);
  const [showMenu, setShowMenu] = useState(false);
  const deleteModalRef = useRef();

  const [localCommentCount, setLocalCommentCount] = useState(post.comments?.length || 0);

  const handleDelete = async () => {
    await handleDeletePost(post);
  };

  const handleLike = async () => {
    try {
      const updatedPost = await handleLikePost(post._id);
      setIsLiked(updatedPost?.likes.includes(user._id));
      setLikeCount(updatedPost?.likes?.length);
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleViewPost = async () => {
    if (post.views.includes(user._id)) return;

    setViewCount((prevCount) => prevCount + 1);

    await updateViewCount({
      postId: post._id,
      token,
    });
  };

  useEffect(() => {
    const handleNewComment = ({ id }) => {
      if (id === post._id) {
        setLocalCommentCount((prevCount) => prevCount + 1);
      }
    };

    socket.on('new comment', handleNewComment);

    return () => {
      socket.off('new comment', handleNewComment);
    };
  }, [post._id]);

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

  // console.log('postLoading: ', postLoading);

  return (
    <div className="light-navbar flex items-start h-48 rounded-lg shadow-lg w-full py-3 px-4">
      {postLoading ? (
        <PulseAnimationLoader />
      ) : (
        <div className="flex items-start flex-col justify-between w-full h-full px-2 ">
          <div className="flex flex-col w-full gap-y-3">
            <div className="flex items-center justify-between w-full">
              <div className="line-clamp-2 font-bold w-[90%]">
                {post?.title} : {post?.content}
              </div>
              <div className="relative flex items-center">
                <div className="hidden md:block lg:block xl:block cursor-pointer" onClick={handleLike}>
                  {isLiked ? <FaHeart className={`text-red-500`} /> : <CiHeart />}
                </div>
                <BsThreeDotsVertical className="cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
                {showMenu && (
                  <div
                    ref={deleteModalRef}
                    className="absolute top-full right-0 z-50 flex flex-col items-center w-28 p-2 space-y-2 light-search rounded-lg"
                  >
                    <div className="rounded-lg light-navbar w-full p-1 light-navbar text-sm cursor-pointer">
                      Update post
                    </div>
                    <div className="rounded-lg light-navbar w-full p-1 cursor-pointer text-sm" onClick={handleDelete}>
                      Delete post
                    </div>
                  </div>
                )}
              </div>
              <div className="block md:hidden lg:hidden xl:hidden">
                <ProfileImage author={post?.author} />
              </div>
            </div>
            <div className="flex items-center gap-x-2 mb-3">
              {post?.tags &&
                post.tags.map((tag, index) => {
                  return (
                    <div key={index} className="rounded-lg shadow-lg text-[10px] p-2 light-search">
                      {tag}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="hidden lg:flex md:flex xl:flex items-center">
              <ProfileImage author={post?.author} />
              <div className="flex flex-col items-start">
                <div className="font-bold text-sm">{post?.author.userName}</div>
                <div className="text-[10px] text-[#48494e]">{formatDistanceToNow(new Date(post?.createdAt))} ago</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#48494e] w-full md:w-[50%] lg:w-[50%] xl:w-[50%]">
              <div className="flex flex-wrap items-center px-2">{viewCount} View</div>
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
              <div
                className="primary text-white rounded-lg px-2 py-1 text-[13px] cursor-pointer"
                onClick={() => {
                  handleViewPost();
                  navigate(`/post/:${post._id}`, { state: { post } });
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
          post={post}
          localCommentCount={localCommentCount}
          setLocalCommentCount={setLocalCommentCount}
        />
      )}
    </div>
  );
};

export default PostComponent;
