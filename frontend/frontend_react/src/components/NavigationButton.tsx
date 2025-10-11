import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Link as MuiLink } from '@mui/material'

interface NavigationButtonProps {
  label: string
  buttonPath: string
}

function NavigationButton({ label, buttonPath }: NavigationButtonProps) {

  const location = useLocation()

  return (
    <MuiLink 
      component={Link}
      to={buttonPath}
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        '&:hover': {
          backgroundColor: '#333',
        },
        color: location.pathname === buttonPath ? 'secondary.main' : 'inherit',
        textDecoration: 'none'
      }}
    >
      {label}
    </MuiLink>
  )
}

export default NavigationButton