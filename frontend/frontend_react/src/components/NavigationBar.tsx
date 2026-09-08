import { Box } from '@mui/material'
import NavigationButton from './NavigationButton'

function NavigationBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '2.5rem',
        width: '100%',
        borderBottom: '1px solid #87ff8755',
        marginBottom: '1rem',
      }}
    >
      <Box sx={{ display: 'flex', gap: '1rem', height: '100%' }}>
        <NavigationButton label="home" buttonPath="/" />
        <NavigationButton label="pong" buttonPath="/pong" />
      </Box>
      <NavigationButton label="contact" buttonPath="/contact" />
    </Box>
  )
}

export default NavigationBar
