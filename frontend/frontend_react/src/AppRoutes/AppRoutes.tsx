import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { pongOverlayVisibleAtom } from '../terminal/TerminalAtoms'
import HomeView from '../views/HomeView'
import PongView from '../views/PongView'
import ContactView from '../views/ContactView'

function AppRoutes() {
  const location = useLocation()
  const [, setPongOverlayVisible] = useAtom(pongOverlayVisibleAtom)

  // Close PongOverlay when navigating between views
  useEffect(() => {
    setPongOverlayVisible(false)
  }, [location.pathname, setPongOverlayVisible])

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