import { Routes, Route, Navigate } from 'react-router-dom'
import HomeView from '../views/HomeView'
import PongView from '../views/PongView'
import ContactView from '../views/ContactView'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/pong" element={<PongView />} />
      <Route path="/contact" element={<ContactView />} />

      {/* Redirect to root if no route matches */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes