import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import HomeView from './views/HomeView'
import PongView from './views/PongView'
import ContactView from './views/ContactView'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/pong" element={<PongView />} />
          <Route path="/contact" element={<ContactView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


