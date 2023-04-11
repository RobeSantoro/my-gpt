import React, { useState } from 'react';

function ChatForm({ messages, setMessages }) {
    const [messageInput, setMessageInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!messageInput.trim()) return;

        // user's chatstripe
        const updatedMessages = [...messages, { role: 'user', content: messageInput }];
        setMessages(updatedMessages);

        // clear the textarea input
        setMessageInput('');

        // Fetch chat response and set messages
        try {
            const response = await fetch('http://localhost:5000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const parsedData = data.ai.trim(); // trims any trailing spaces/'\n'
                setMessages([...updatedMessages, { role: 'assistant', content: parsedData }]);
            } else {
                const err = await response.text();
                alert(err);
            }
        } catch (error) {
            alert('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="messageInput"
            />
            <button type="submit" className="sendButton">
                Send
            </button>
        </form>
    );
}

export default ChatForm;