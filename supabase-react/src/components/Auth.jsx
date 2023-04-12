import { useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  const handleLoginGoogle = async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const handleLoginDiscord = async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    })
  }

  return (
    <div className="min-h-screen px-6 hero bg-base-200">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Mio GPT</h1>
        <p className="py-6">Registrati con il link magico</p>

        {/* LOGIN MAGIC LINK */}
        <form className="" onSubmit={handleLogin}>
          <div>
            <input
              className="w-full input input-bordered input-primary"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button className="w-full my-2 btn btn-primary" disabled={loading}>
              {loading ? <span>Caricamento</span> : <span>Ottieni il link magico</span>}
            </button>
          </div>
        </form>

        <p className="py-6">oppure</p>
        {/* LOGIN OAUTH GOOGLE */}

        <button
          className="w-full my-1 btn btn-accent"
          onClick={handleLoginGoogle}
        >
          Usa Google Account
        </button>

        {/* LOGIN OAUTH DISCORD */}
        <button
          className="w-full btn btn-secondary"
          onClick={handleLoginDiscord}
        >
          Usa Discord Account
        </button>



      </div>
    </div>
  )
}