import React from 'react';

function Message({ message, botImg, userImg }) {
  const isUser = message.role === 'user';
  const imgSrc = isUser ? userImg : botImg;

  return (
    <div className="chat chat-start">
      
      <div className={isUser ? 'chat-image avatar' : 'chat-image avatar'}>
        <img src={imgSrc} alt={isUser ? 'User' : 'Ai'} />
        <div className="messageContent">{message.content}</div>
      </div>
    </div>
  );
}

export default Message;


