import { Box } from '@mui/material'
import { type ReactNode } from 'react'
import WebVM from '../webvm/components/WebVM'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: '10px',
        maxWidth: '800px',
        padding: '0 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {children}
      <WebVM />
      <Footer />
    </Box>
  )
}

export default Layout
