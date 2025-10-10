import { Box } from "@mui/material";
import AboveTerminalText from "./AboveTerminalText";
import Photo from "./Photo";

interface AboveTerminalProps {
  children: React.ReactNode;
}

function AboveTerminal({ children }: AboveTerminalProps) {
  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      
    }}>
      <AboveTerminalText>
        {children}
      </AboveTerminalText>
      <Photo />
    </Box>
  )
}

export default AboveTerminal;