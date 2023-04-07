import './App.css'
import bot from './assets/bot.svg'
import user from './assets/user.svg'
import send from './assets/send.svg'

function App() {

  return (

    <div id='app'>

      <aside className="w-1/3 h-screen p-1 bg-slate-950">
        <h2 className="text-xs">Chat History</h2>
      </aside>
      
      <section className="w-2/3 text-center" >
        <h1 className="p-2 text-xl" >My GPT</h1>
        <div id="chat_container"></div>
        <form action="">
          <textarea
            name="message"
            cols="30"
            rows="10"
            placeholder="Ctrl + Enter to send...">
          </textarea>
          <button>
            <img src={send} alt='send' />
          </button>
        </form>
      </section>
    </div>
  )
}

export default App
