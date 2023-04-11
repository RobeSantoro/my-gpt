import React from 'react';

function Message({ message, botImg, userImg }) {
  const isUser = message.role === 'user';
  const imgSrc = isUser ? userImg : botImg;

  return (
    <div className={`messageContainer ${isUser ? 'userMessage' : 'botMessage'}`}>
      <img src={imgSrc} alt={isUser ? 'User' : 'Bot'} />
      <div className="messageContent">{message.content}</div>
    </div>
  );
}

export default Message;
