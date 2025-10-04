import { Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AboveTerminalTextProps {
  children: ReactNode;
}

function AboveTerminalText({ children }: AboveTerminalTextProps) {
  return (
    <Typography 
      variant="body1" 
      sx={{
        fontFamily: 'Fira Mono',
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

export default AboveTerminalText;