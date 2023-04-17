import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import Auth from './components/Auth.jsx'
import Account from './components/Account.jsx'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="flex flex-col h-screen align-middle place-items-center">
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}

export default App