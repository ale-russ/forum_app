import React, { useState, useEffect } from 'react';

import { InputComponent } from '../common/InputComponent';
import { useForum } from '../../utils/PostContext';
import { useSocket } from '../../utils/SocketContext';

const PrivateChat = ({ recipient, onClose }) => {
  const { user } = useForum();
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (socket) {
      const handlePrivateMessage = ({ message }) => {
        console.log('Received message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      const handleError = (errorMessage) => {
        console.error('Socket error:', errorMessage);
      };

      socket.on('private message', handlePrivateMessage);
      socket.on('error', handleError);

      return () => {
        socket.off('private message', handlePrivateMessage);
        socket.off('error', handleError);
      };
    }
  }, [socket]);

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  const sendPrivateMessage = () => {
    if (input.trim() && socket) {
      const message = {
        content: input,
        from: user._id,
        to: recipient._id,
        timestamp: new Date().toISOString(),
      };
      console.log('Sending Private message:', message);
      socket.emit('private message', { message, recipient });
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
      setShowPicker(false);
    }
  };

  return (
    <div className="w-80 h-[600px] light-navbar border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300">
      <div className="bg-zinc-800 rounded-t-lg p-3 flex items-center justify-between font-bold text-white w-full">
        <h2>{recipient.userName}</h2>
        <div
          className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
          onClick={() => onClose()}
        >
          X
        </div>
      </div>
      <div key={messages.length} className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar custom-scrollbar w-full">
        {messages.map((msg) => {
          const isCurrentUser = msg.from === user._id;
          const key = `${msg.timestamp}-${Math.random()}`;

          return (
            <div key={key} className={`w-full flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={` rounded-lg shadow-xl border-gray-200 min-w-10 max-w-40 flex
                ${isCurrentUser ? 'bg-blue-600 text-right' : 'bg-zinc-600 text-left'}`}
              >
                <span
                  className={`inline-block px-1 py-1 rounded-lg text-[12px] ${
                    isCurrentUser ? 'text-white' : 'text-red-200'
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <InputComponent
        input={input}
        setInput={setInput}
        handleSendMessage={sendPrivateMessage}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        socket={socket}
      />
    </div>
  );
};

export default PrivateChat;
