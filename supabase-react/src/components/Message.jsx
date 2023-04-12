import React from 'react';
import bot from '../assets/bot.svg'
import Avatar from './Avatar';

function Message({ message, username, avatar_url }) {

  const isUser = message.role === 'user';

  return (

    <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`}>

      <div className="chat-image avatar">
        <div className="w-10 ">
          {isUser ? (
            <Avatar
              url={avatar_url}
              thumbnail={true}
            />
          ) : (
            <img src={bot} />
          )}
        </div>
      </div>

      <div className="chat-header">
        {isUser ? username : 'AI'}
      </div>

      <div className="chat-bubble">{message.content}</div>
      <div className="opacity-50 chat-footer">
        {/* <time className="text-xs opacity-50">12:45</time> */}
      </div>

    </div>

  );
}

export default Message;


