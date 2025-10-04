import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomeView from './views/HomeView'
import PongView from './views/PongView'
import ContactView from './views/ContactView'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
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


