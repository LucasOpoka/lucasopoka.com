import { Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface AboveTerminalTextProps {
  children: ReactNode
}

function AboveTerminalText({ children }: AboveTerminalTextProps) {
  return (
    <Typography
      sx={{
        fontSize: '0.8rem',
        lineHeight: 1.3,
        height: '100%',
        width: 620,
        textAlign: 'left',
        mt: -0.5,
      }}
    >
      {children}
    </Typography>
  )
}

export default AboveTerminalText
