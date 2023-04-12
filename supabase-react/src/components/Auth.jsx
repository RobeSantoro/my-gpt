import { useState } from 'react'
import { supabase } from '../supabaseClient.js'

import bot from '../assets/bot.svg'

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
      <div className="flex flex-col items-center text-center ">
        <img src={bot} alt="" className="w-20" />
        <h1 className="text-3xl font-bold text-white">Il Mio Trasformatore Generativo Precedentemente Addestrato</h1>
        <p className="py-6">Registrati con il link magico</p>

        {/* LOGIN MAGIC LINK */}
        <form className="" onSubmit={handleLogin}>

            <input
              className="w-full input input-bordered input-primary"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="w-full my-1 btn btn-primary" disabled={loading}>
              {loading ? <span>Caricamento</span> : <span>Ottieni il link magico</span>}
            </button>

        </form>

        <p className="py-6">oppure</p>
        {/* LOGIN OAUTH GOOGLE */}

        <button
          className="w-full my-1 btn btn-secondary "
          onClick={handleLoginGoogle}
        >
          Usa Google Account
        </button>

        {/* LOGIN OAUTH DISCORD */}
        <button
          className="w-full btn btn-accent"
          onClick={handleLoginDiscord}
        >
          Usa Discord Account
        </button>



      </div>
    </div>
  )
}