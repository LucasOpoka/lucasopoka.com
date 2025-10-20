import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Link as MuiLink } from '@mui/material'
import { useAtom } from 'jotai'
import { navigationRunningAtom } from '../webvm/WebVmAtoms'

interface NavigationButtonProps {
  label: string
  buttonPath: string
}

function NavigationButton({ label, buttonPath }: NavigationButtonProps) {

  const location = useLocation()
  const [navigationRunning] = useAtom(navigationRunningAtom)

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
          backgroundColor: navigationRunning ? 'transparent' : '#333',
        },
        color: location.pathname === buttonPath ? 'secondary.main' : 'inherit',
        textDecoration: 'none',
        opacity: navigationRunning ? 0.5 : 1,
        pointerEvents: navigationRunning ? 'none' : 'auto',
        cursor: navigationRunning ? 'not-allowed' : 'pointer'
      }}
    >
      {label}
    </MuiLink>
  )
}

export default NavigationButton