import React, { useState } from 'react';

function ChatForm({ messages, setMessages }) {
  const [messageInput, setMessageInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    // user's chatstripe

    const updatedMessages = [
      { role: 'system', content: 'You are a helpful assistant, that says "Sir" at the beginning of every answer.' },
      ...messages,
      { role: 'user', content: messageInput }];

    setMessages([...messages, { role: 'user', content: messageInput }]);

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
        setMessages([...messages, { role: 'user', content: messageInput }, { role: 'assistant', content: parsedData }]);
      } else {
        const err = await response.text();
        alert(err);
      }
    } catch (error) {
      alert('Error:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="messageInput"
        placeholder="Ctrl + Enter to send..."
      />
      <button type="submit" className="sendButton">
        Send
      </button>
    </form>
  );
}

export default ChatForm;