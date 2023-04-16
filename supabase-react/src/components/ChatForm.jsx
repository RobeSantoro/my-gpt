import React, { useState } from 'react';


function ChatForm({ messages, setMessages }) {

  const [messageInput, setMessageInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [systemInstruction, setSystemInstruction] = useState('You are a helpful assistant, your name is My GPT. You say "Sir" at the beginning of every answer.')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageInput) return;

    const updatedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages,
      { role: 'user', content: messageInput }];

    setMessages([...messages, { role: 'user', content: messageInput }]);

    const apiUrl = import.meta.env.VITE_DEBUG_SERVER == 'true' ? (
      import.meta.env.VITE_LOCALHOST_URL
    ) : (
      import.meta.env.VITE_RENDERCOM_URL
    )

    console.log(apiUrl);

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
        const parsedData = data.ai // .trim() any trailing spaces/'\n'
        setMessages([...messages, { role: 'user', content: messageInput }, { role: 'assistant', content: parsedData }]);
      } else {
        const err = await response.text();
        alert(err);
      }
    } catch (error) {
      alert('Error:', error);
    }

    // clear the textarea input
    setMessageInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSystemInstructionChange = (e) => {
    setSystemInstruction(e.target.value)
  }

  return (

    <div className='stretch flex flex-row gap-3 '>
      <div className='relative flex flex-col flex-grow w-full rounded-md '>
        <form onSubmit={handleSubmit}>

          <textarea
            className="w-full h-24 text-black bg-white textarea textarea-secondary px-2 py-1"
            name="message"
            value={messageInput.replace(/  +/g, '\n')}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ctrl + Enter to send..."
          />

          <div className='flex flex-row gap-1'>

            <input type="text"
              className='rounded-lg w-full px-2 text-black'
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

  );
}

export default ChatForm;