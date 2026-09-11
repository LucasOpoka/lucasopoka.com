import { Routes, Route, Navigate } from 'react-router-dom'
import HomeView from '../views/HomeView'
import PongView from '../views/PongView'
import ContactView from '../views/ContactView'
import WebVmFrame from '../webvm/components/WebVmFrame'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/pong" element={<PongView />} />
      <Route path="/contact" element={<ContactView />} />

      {/* Internal-only route loaded inside the WebVM <iframe> - see WebVmEmbed/WebVmFrame */}
      <Route path="/webvm-frame" element={<WebVmFrame />} />

      {/* Redirect to root if no route matches */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes
