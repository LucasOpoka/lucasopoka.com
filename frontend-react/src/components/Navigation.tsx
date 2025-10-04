import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

const Navigation: React.FC = () => {
  const location = useLocation()
  
  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  return (
    <div id="top-nav">
      <ul>
        <li>
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            home
          </Link>
        </li>
        <li>
          <Link 
            to="/pong" 
            className={isActive('/pong') ? 'active' : ''}
          >
            pong
          </Link>
        </li>
        <li className="right">
          <Link 
            to="/contact" 
            className={isActive('/contact') ? 'active' : ''}
          >
            contact
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navigation


