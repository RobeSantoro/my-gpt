import './App.css'
import bot from './assets/bot.svg'
import user from './assets/user.svg'
import send from './assets/send.svg'

function App() {

  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col items-center justify-center drawer-content">
        {/* <!-- Page content here --> */}
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>

      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="p-4 menu w-80 bg-base-100 text-base-content">
          {/* <!-- Sidebar content here --> */}
          <li><a>Sidebar Item 1</a></li>
          <li><a>Sidebar Item 2</a></li>
        </ul>

      </div>
    </div>

  )
}

export default App

/* 

<div className="drawer">

<section className="drawer-content">

  <h1 className="p-2 text-xl" >My GPT</h1>
  <div id="chat_container"></div>
  <form action="">
    <textarea
      name="message"
      cols="30"
      rows="10"
      placeholder="Ctrl + Enter to send...">
    </textarea>
    <button className="btn">
      <img src={send} alt='send' />Send
    </button>
  </form>

  <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
</section>

<aside className="drawer-side">

  <label htmlFor="my-drawer" className="drawer-overlay"></label>
  
  <h2 className="text-xs">Chat History</h2>
  <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
  <ul className="p-4 menu w-80 bg-base-100 text-base-content">
    <li><a>Sidebar Item 1</a></li>
    <li><a>Sidebar Item 2</a></li>
  </ul>
</aside>

</div> */