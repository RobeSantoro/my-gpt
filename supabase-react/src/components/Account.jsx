import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'
import Avatar from './Avatar'

import Chat from './Chat'

function Account({ session }) {

  const loadLastChatMessages = () => {
    const storedMessages = localStorage.getItem('messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  };

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
    link.download = 'conversation.json';
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

  }

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

  return (
    <div className="container flex flex-1 bg-base-100">

      <div className='flex flex-col justify-between flex-1'>

        {/* NAVBAR */}
        <div className="navbar bg-primary">
          <div className="dropdown">

            {/* LEFT MENU */}
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
            <h2 className="text-2xl normal-case ">Mio GPT</h2>
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

export default Account;


{/* SHOPPING CART */ }
{/* <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="badge badge-sm indicator-item">8</span>
              </div>
            </label>
            <div tabIndex={0} className="mt-3 shadow card card-compact dropdown-content w-52 bg-base-100">
              <div className="card-body">
                <span className="text-lg font-bold">8 Items</span>
                <span className="text-info">Subtotal: $999</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">View cart</button>
                </div>
              </div>
            </div>
          </div> */}

{/* BIG BUTTONS MODAL */ }
{/* <input type="checkbox" id="big-buttons-modal" className="modal-toggle" />
        <div className='modal' >
          <ul tabIndex={0} className="flex flex-col justify-center gap-3 px-10 ">
            <li className='w-full btn btn-primary' >Nuova Conversazione</li>
            <li className='w-full btn' >Conversazioni Salvate</li>
            <li className='w-full btn btn-accent' >Informarmazioni Privacy</li>
          </ul>
        </div> */}



{/* FOOTER
        <div className="flex justify-between px-20 pb-1">

          <button className='flex flex-col items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="btm-nav-label">Home</span>
          </button>
          <button className='flex flex-col items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="btm-nav-label">Warnings</span>
          </button>
          <button className='flex flex-col items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="btm-nav-label">Statics</span>
          </button>

        </div> */}