import React, { useState } from 'react';


function ChatForm({ messages, setMessages, className }) {
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

    // Fetch the response from the API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', //gpt-4 //gpt-3.5-turbo THE SELECT HAS TO BE IMPLEMENTED
          messages: updatedMessages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // const parsedData = data.ai.trim(); // trims any trailing spaces/'\n'
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

    <div className={className}>

      <div className='stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl'>
        <div className='relative flex flex-col flex-grow w-full mx-2 rounded-md sm:mx-4'>
          <form onSubmit={handleSubmit}>

            <textarea
              className="w-full h-24 m-1 text-black bg-white md:py-3 md:pl-10 textarea textarea-secondary" // w-full h-24 m-1 text-black  textarea textarea-secondary
              name="message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ctrl + Enter to send..."
            />
          </form>

          <div className='flex flex-row'>
            <select className=" select select-primary">
              <option disabled selected>MODEL</option>
              <option>gpt-3.5-turbo</option>
              <option>gpt-4</option>
            </select>

            <button type="submit"
              className="btn btn-primary"  // h-auto m-1 btn btn-primary
            >
              Invia
            </button>
          </div>

        </div>
      </div>
    </div>


  );
}

export default ChatForm;