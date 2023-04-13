import React, { useState } from 'react';


function ChatForm({ messages, setMessages }) {
  const [messageInput, setMessageInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    const updatedMessages = [
      { role: 'system', content: 'You are a helpful assistant, your name is GPT-4. You say "Sir" at the beginning of every answer.' },
      ...messages,
      { role: 'user', content: messageInput }];

    setMessages([...messages, { role: 'user', content: messageInput }]);

    // clear the textarea input
    setMessageInput('');

    const apiUrl = import.meta.env.VITE_DEBUG ? (
      import.meta.env.VITE_LOCALHOST_URL
    ) : (
      import.meta.env.VITE_RENDERCOM_URL
    )

    console.log(apiUrl);

    // Fetch chat response and set messages
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', //gpt-4 //gpt-3.5-turbo
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