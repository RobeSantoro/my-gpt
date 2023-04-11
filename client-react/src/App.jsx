import React, { useState } from 'react';
import './App.css';
import bot from './assets/bot.svg';
import user from './assets/user.svg';
import send from './assets/send.svg';
import ChatForm from './components/ChatForm';
import Message from './components/Message';
import Drawer from './components/Drawer';

function App() {
    const [messages, setMessages] = useState([]);

    return (
        <div className="drawer drawer-mobile">

            <input id="chats-drawer" type="checkbox" className="drawer-toggle" />

            <div className="flex flex-col drawer-content">

                <label htmlFor="chats-drawer" className="btn btn-primary drawer-button">Open drawer</label>

                <div className="chatContainer">
                    {messages.map((message, index) => (
                        <Message key={index} message={message} botImg={bot} userImg={user} className="chat-bubble " />
                    ))}
                </div>

                <ChatForm messages={messages} setMessages={setMessages} />

            </div>

            <Drawer />
        </div>
    );
}

export default App;