import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'
import Avatar from './Avatar'

import Chat from './Chat'

function Account({ session }) {

  const [conversationTitle, setConversationTitle] = useState('Mio GPT')
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const createNewConversation = () => {
    localStorage.removeItem('messages');
    setLastMessages([]);
    document.activeElement.blur()
  };

  const openJSONConversation = () => {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const messages = JSON.parse(event.target.result);
        setLastMessages(messages);
        localStorage.setItem('messages', JSON.stringify(messages));
      };

      reader.readAsText(file);
    };

    input.click();

  }

  const saveJSONConversation = () => {

    const data = JSON.stringify(lastMessages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${conversationTitle}.json`;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

  }

  const loadLastChatMessages = () => {
    const storedMessages = localStorage.getItem('messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  };

  const [lastMessages, setLastMessages] = useState(loadLastChatMessages());

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [full_name, setFull_name] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    async function getProfile() {
      setLoading(true)
      const { user } = session

      let { data, error } = await supabase
        .from('profiles')
        .select(`username, full_name, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error) {
        console.warn(error)
      } else if (data) {
        setUsername(data.username)
        setFull_name(data.full_name)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }

      setLoading(false)
    }

    getProfile()
  }, [session])

  async function updateProfile(event) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id: user.id,
      username,
      full_name,
      website,
      avatar_url,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    }
    setLoading(false)
  }

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (event) => {
    setConversationTitle(event.target.value);
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="container flex flex-1 bg-base-100">

      <div className='flex flex-col justify-between flex-1'>

        {/* NAVBAR */}
        <div className="navbar bg-primary">

          {/* LEFT MENU */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>

            <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">

              {/* NEW CONVERSATION */}
              <li onClick={createNewConversation}>
                <a>Nuova Conversazione</a>
              </li>

              <li onClick={openJSONConversation}>
                <a>Apri Conversazione</a></li>

              <li onClick={saveJSONConversation}>
                <a>Salva Conversazione</a></li>

              {/* <li><a>Informazioni Privacy</a></li> */}
            </ul>
          </div>

          {/* CENTERD TITLE */}
          <div className="flex-1 place-content-center">
            {isEditingTitle ? (
              <input
                type="text"
                value={conversationTitle}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown}
                placeholder="Titolo Conversazione"
                className="w-full max-w-xs input input-bordered"
              />
            ) : (
              <h2
                className="text-2xl normal-case cursor-pointer"
                onClick={handleTitleClick}
              >
                {conversationTitle}
              </h2>
            )}
          </div>

          {/* RIGHT MENU */}
          <div className="flex-none">

            {/* MINI AVATAR DROPDOWN */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="bg-white btn btn-ghost btn-circle avatar">
                <div className="rounded-full ">
                  <Avatar
                    url={avatar_url}
                    thumbnail={true}
                  />
                </div>
              </label>
              <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <a className="justify-between">
                    Compra Crediti
                    <span className="badge">13</span>
                  </a>
                </li>

                <li>
                  {/* TOGGLE PROFILE SETTINGS */}
                  <label htmlFor="settings-modal" >Impostazioni Profilo</label>
                </li>

                <li>
                  <button className=" btn-ghost" type="button" onClick={() => supabase.auth.signOut()}>
                    Esci
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* SETTINGS MODAL */}
        <input type="checkbox" id="settings-modal" className="modal-toggle" />
        <div id='account-settings' className="modal">
          <div className="modal-box">

            <form onSubmit={updateProfile} className="">

              <Avatar
                url={avatar_url}
                size={100}
                onUpload={(event, url) => {
                  setAvatarUrl(url)
                  updateProfile(event)
                }}
              />

              <div>
                <label htmlFor="email" className="label">
                  <span className="label-text-alt">Posta Elettronica</span>
                </label>
                <input id="email" type="text" value={session.user.email}
                  disabled
                  className="w-full input input-bordered" />
              </div>

              <div>
                <label htmlFor="username" className="label">
                  <span className="label-text-alt">Nome Utente</span>
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full input input-bordered input-secondary"
                />
              </div>

              <div>
                <label htmlFor="full_name" className="label">
                  <span className="label-text-alt">Nome e Cognome</span>

                </label>
                <input
                  id="full_name"
                  type="text"
                  value={full_name || ''}
                  onChange={(e) => setFull_name(e.target.value)}
                  className="w-full input input-bordered input-secondary"
                />
              </div>

              <div>
                <label htmlFor="website" className="label">
                  <span className="label-text-alt">Sito Web</span>
                </label>
                <input
                  id="website"
                  type="website"
                  value={website || ''}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full input input-bordered input-secondary"
                />
              </div>

              <div className="modal-action">

                {/* <label htmlFor="settings-modal" className="btn">Cancel</label> */}
                <label htmlFor="settings-modal" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>

                <button type="submit" disabled={loading} className="w-full btn btn-accent">
                  {loading ? ' ...' : 'Salva'}
                </button>

              </div>

            </form>

          </div>
        </div>

        <Chat
          username={username}
          avatar_url={avatar_url}
          lastMessages={lastMessages}
        />

      </div>
    </div >
  )
}

export default Account