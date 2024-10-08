import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { fetchChatMessages } from '../../controllers/ChatController';
import { InputComponent } from '../common/InputComponent';
import { useForum } from '../../utils/PostContext';
import { useSocket } from '../../utils/SocketContext';
import ProfileImage from '../common/ProfileImage';

const ChatTile = ({ handleToggle, setIsOpen, openChatModal, generalChatRef }) => {
  const navigate = useNavigate();
  const { user, onlineUsers, chatRooms } = useForum();
  const socket = useSocket();

  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const container = messagesEndRef?.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  const handleChatMessages = async () => {
    try {
      const { data } = await fetchChatMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = () => {
    console.log('In handleSendMessage');
    if (input.trim()) {
      const message = {
        author: {
          _id: user._id,
          userName: user.userName,
        },
        content: input,
        createdAt: new Date(),
      };

      console.log('Message sent: ', message);

      socket.emit('chat message', {
        room: 'General',
        message,
      });
      setInput('');
      setShowPicker(false);
    }
  };

  useEffect(() => {
    scrollToBottom;
  }, [messages]);

  useEffect(() => {
    handleChatMessages();
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(() => scrollToBottom(), 0);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    socket.on('typingResponse', (data) => {
      console.log('data: ', data);
      setTypingStatus(data);
    });
  }, [socket, messages]);

  return (
    <div
      ref={generalChatRef}
      className={`w-66 h-[500px] ml-1 light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300 ${
        setIsOpen ? 'open-animation' : 'close-animation'
      }`}
    >
      <div className="bg-zinc-800 rounded-t-lg p-3 flex flex-col items-center justify-between font-bold text-white w-full">
        <div className="bg-zinc-800 rounded-t-lg p-3 flex items-center justify-between font-bold text-white w-full h-8">
          General Chat
          <div
            className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
            onClick={() => handleToggle(false)}
          >
            X
          </div>
        </div>
        Online Users
        <div className="flex items-center justify-start space-x-2 w-full overflow-x-auto scrollbar custom-scrollbar">
          {chatRooms[0].users &&
            chatRooms[0].users
              ?.filter((usr) => {
                return usr._id !== user._id;
              })
              .map((usr) => {
                const isOnline = onlineUsers?.some((onlineUser) => onlineUser.user._id === usr._id);

                return (
                  <div
                    className="flex cursor-pointer"
                    key={usr._id}
                    onClick={() => {
                      navigate(`/chat/private-chat/${usr._id}`, {
                        state: { recipient: usr },
                      });
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <ProfileImage author={usr} />
                      <p>{usr.userName}</p>
                    </div>
                    {isOnline && <div className="rounded-full h-3 w-3 bg-green-500 relative top-1 right-[18px]" />}
                  </div>
                );
              })}
        </div>
      </div>
      <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
        {messages?.map((msg, index) => {
          const isCurrentUser = msg.author._id === user._id;
          return (
            <div key={index} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
              {msg.author._id !== user._id && <p className="text-xs italic mb-1">{msg.author.userName}</p>}
              <div
                className={`rounded-lg shadow-xl border-gray-200 min-w-10 max-w-40 flex ${
                  isCurrentUser ? 'bg-blue-600 text-right' : 'bg-zinc-600 text-left'
                }`}
              >
                <span
                  className={`inline-block px-1 py-1 rounded-lg text-[12px] ${
                    isCurrentUser ? 'text-white' : 'text-gray-200'
                  }`}
                >
                  {msg.content}
                </span>
              </div>
              <p className="text-[10px] italic">{formatDistanceToNow(msg.createdAt)} ago</p>
            </div>
          );
        })}

        <p className="text-sm text-gray-400 ">{typingStatus}</p>
      </div>
      <InputComponent
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        input={input}
        socket={socket}
      />
    </div>
  );
};

export default ChatTile;
