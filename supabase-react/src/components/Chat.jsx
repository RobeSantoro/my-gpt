import React, { useState, useEffect } from 'react';
import Message from './Message'

function Chat({ username, avatar_url, lastMessages }) {

  const saveLastMessages = (messages) => {
    localStorage.setItem('messages', JSON.stringify(messages));
  };

  const [messages, setMessages] = useState(lastMessages);

  useEffect(() => {
    setMessages(lastMessages);
  }, [lastMessages]);

  const [messageInput, setMessageInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [systemInstruction, setSystemInstruction] = useState('You are a helpful assistant, your name is My GPT. You say "Sir" at the beginning of every answer.')

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSystemInstructionChange = (e) => {
    setSystemInstruction(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageInput) return;

    setMessages([...messages, { role: 'user', content: messageInput }]);

    const updatedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages,
      { role: 'user', content: messageInput }];


    const apiUrl = import.meta.env.VITE_DEBUG_SERVER == 'true' ? (
      import.meta.env.VITE_LOCALHOST_URL
    ) : (
      import.meta.env.VITE_RENDERCOM_URL
    )

    // clear the textarea input
    setMessageInput('');

    // Fetch the response from the API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: updatedMessages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.ai

        const newMessages = [...messages, { role: 'user', content: messageInput }, { role: 'assistant', content: parsedData }];
        setMessages(newMessages);
        saveLastMessages(newMessages);

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

    <div id='chat' className='mx-2 mb-3'>
      <div id='chat-container' className='mb-3 '>
        {messages.map((message, index) => (

          <Message
            key={index}
            message={message}
            username={username}
            avatar_url={avatar_url}
          />

        ))}
      </div>

      {/* FORM */}
      <div className='flex flex-row gap-3 stretch '>
        <div className='relative flex flex-col flex-grow w-full rounded-md '>
          <form onSubmit={handleSubmit}>

            <textarea
              className="w-full h-24 px-2 py-1 text-black bg-white textarea textarea-secondary"
              name="message"
              value={messageInput} //.replace(/  +/g, '\n') doesn't work
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ctrl + Enter to send..."
            />

            <div className='flex flex-row gap-1'>

              <input type="text"
                className='w-full px-2 text-black rounded-lg'
                value={systemInstruction}
                onChange={handleSystemInstructionChange}
                placeholder='System Instruction'
              />

              <select
                className="select select-primary"
                value={selectedModel}
                onChange={handleModelChange}
              >
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
              </select>

              <button type="submit" className="btn btn-primary">
                Invia
              </button>

            </div>
          </form>
        </div>
      </div>

    </div>

  );
}

export default Chat;