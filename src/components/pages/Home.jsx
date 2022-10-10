import Chat from "../Chat"
import Sidebar from "../Sidebar"
import "../Styles.scss"


function Home() {
  return (
    <div className="home-container">
        <div className="home-app">
            <Sidebar />
            <Chat />
        </div>
    </div>
  )
}

export default Home