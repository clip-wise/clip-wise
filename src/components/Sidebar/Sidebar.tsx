import React, { useState, useEffect } from 'react';

interface Message {
  user: string;
  text: string;
  timestamp: string;
}

const Sidebar: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`);

  // Adjust YouTube video width when sidebar is mounted
  // useEffect(() => {
  //   const video = document.querySelector<HTMLElement>('#primary');
  //   if (video) {
  //     video.style.width = 'calc(100% - 400px)';
  //     video.style.transition = 'width 0.3s ease';
  //   }

  //   return () => {
  //     if (video) {
  //       video.style.width = '100%';
  //     }
  //   };
  // }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          user: username,
          text: newMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className='fixed right-0 top-0 w-[400px] h-screen bg-white text-black z-50 flex flex-col border-l border-gray-300'>
      {/* Header */}
      <div className='p-4 border-b border-gray-300 flex justify-between items-center'>
        <h3 className='m-0'>Watch Party</h3>
        <span>{username}</span>
      </div>
    </div>
  );
};

export default Sidebar;
