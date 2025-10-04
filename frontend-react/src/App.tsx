import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeView from './views/HomeView'
import PongView from './views/PongView'
import ContactView from './views/ContactView'

function App() {
  return (
    <Router>
      <div className="app">
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


