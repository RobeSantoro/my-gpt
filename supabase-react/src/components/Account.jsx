import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'
import Avatar from './Avatar.jsx'

export default function Account({ session }) {
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
    <div className="container bg-base-100">
      <div className=" rounded-b-3xl navbar bg-base-100">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </label>
          <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Nuova Conversazione</a></li>
            <li><a>Conversazioni Salvate</a></li>
            <li><a>Informazioni</a></li>
          </ul>
        </div>

        <div className="flex-1 place-content-center">
          <h2 className="text-2xl normal-case ">Mio GPT</h2>
        </div>

        <div className="flex-none">

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

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={avatar_url} />
              </div>
            </label>
            <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Compra Crediti
                  {/* <span className="badge">New</span> */}
                </a>
              </li>
              <li>
                {/* The button to open modal */}
                <label htmlFor="my-modal" >Impostazioni Profilo</label>
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


      {/* MODAL SETTINGS */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">

          <form onSubmit={updateProfile} className="">

            <Avatar
              url={avatar_url}
              size={200}
              onUpload={(event, url) => {
                setAvatarUrl(url)
                updateProfile(event)
              }}
            />

            <div>
              <label htmlFor="email" className="label">
                <span className="label-text-alt">Email</span>
              </label>
              <input id="email" type="text" value={session.user.email}
                disabled
                className="w-full input input-bordered input-primary" />
            </div>

            <div>
              <label htmlFor="username" className="label">
                <span className="label-text-alt">Username</span>
              </label>
              <input
                id="username"
                type="text"
                required
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full input input-bordered input-primary"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="label">
                <span className="label-text-alt">Full name</span>

              </label>
              <input
                id="full_name"
                type="text"
                value={full_name || ''}
                onChange={(e) => setFull_name(e.target.value)}
                className="w-full input input-bordered input-primary"
              />
            </div>

            <div>
              <label htmlFor="website" className="label">
                <span className="label-text-alt">Website</span>
              </label>
              <input
                id="website"
                type="website"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full input input-bordered input-primary"
              />
            </div>

            <div className="modal-action">

              {/* <label htmlFor="my-modal" className="btn">Cancel</label> */}
              <label htmlFor="my-modal" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>

              <button type="submit" disabled={loading} className="w-full btn btn-primary">
                {loading ? ' ...' : 'Aggiorna'}
              </button>

            </div>

          </form>

        </div>
      </div>

      {/* FOOTER */}
      <div className="btm-nav">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="btm-nav-label">Home</span>
        </button>
        <button className="active">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="btm-nav-label">Warnings</span>
        </button>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="btm-nav-label">Statics</span>
        </button>
      </div>

    </div>
  )
}