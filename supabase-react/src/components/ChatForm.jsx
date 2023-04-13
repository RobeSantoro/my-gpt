import React, { useState } from 'react';

const isDebug = import.meta.env.DEBUG
const renderComUrl = import.meta.env.RENDER_COM_URL
const localhost = import.meta.env.LOCALHOST_URL

function ChatForm({ messages, setMessages }) {
  const [messageInput, setMessageInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    // user's chatstripe

    const updatedMessages = [
      { role: 'system', content: 'You are a helpful assistant, your name is GPT-4. You say "Sir" at the beginning of every answer.' },
      ...messages,
      { role: 'user', content: messageInput }];

    setMessages([...messages, { role: 'user', content: messageInput }]);

    // clear the textarea input
    setMessageInput('');

    console.log('isDebug', isDebug);
    console.log('renderComUrl', renderComUrl);
    console.log('localhost', localhost);

    url_to_fetch = `${isDebug ? localhost : renderComUrl}`
    console.log('url_to_fetch', url_to_fetch);

    // Fetch chat response and set messages
    try {
      const response = await fetch(url_to_fetch, {
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

    <form
      onSubmit={handleSubmit}
      className="box-border"
    >
      <div className="absolute bottom-0 w-full ">
        <div className='flex justify-between w-full'>
          <textarea
            className="w-full h-24 m-1 text-black bg-white textarea textarea-secondary"
            name="message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ctrl + Enter to send..."
          />
          <button type="submit" className="h-auto m-1 btn btn-primary">Invia</button>
        </div>
      </div>
    </form>

  );
}

export default ChatForm;