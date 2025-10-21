import { useNavigate, useLocation } from 'react-router-dom'
import { Link as MuiLink } from '@mui/material'

interface NavigationButtonProps {
  label: string
  buttonPath: string
}

function NavigationButton({ label, buttonPath }: NavigationButtonProps) {

  const currentLocation = useLocation()
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(buttonPath, { replace: true })
    location.reload()
  }

  return (
    <MuiLink 
      onClick={handleClick}
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        '&:hover': {
          backgroundColor: '#333',
        },
        color: currentLocation.pathname === buttonPath ? 'secondary.main' : 'inherit',
        textDecoration: 'none',
        opacity: 1,
        pointerEvents: 'auto',
        cursor: 'pointer'
      }}
    >
      {label}
    </MuiLink>
  )
}

export default NavigationButton