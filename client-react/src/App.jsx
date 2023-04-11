import React, { useState } from 'react';
import './App.css';
import bot from './assets/bot.svg';
import user from './assets/user.svg';
import send from './assets/send.svg';
import ChatForm from './components/ChatForm';
import Message from './components/Message';

function App() {
    const [messages, setMessages] = useState([{ role: 'assistant', content: 'You are a helpful assistant.' }]);

    return (
        <div className="container">
            <div className="chatContainer">
                {messages.map((message, index) => (
                    <Message key={index} message={message} botImg={bot} userImg={user} />
                ))}
            </div>
            <ChatForm messages={messages} setMessages={setMessages} />
        </div>
    );
}

export default App