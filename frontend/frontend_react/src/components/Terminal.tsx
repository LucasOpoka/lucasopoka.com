import { Box } from "@mui/material";
import XTerm from "./XTerm";

export const TERMINAL_WIDTH = 797;
export const TERMINAL_HEIGHT = 427;
export const BORDER_WIDTH = 7.5;
export const BORDER_HEIGHT = 15;

function Terminal() {
  return (
    <Box
      sx={{
        mt: 2,
        height: `${TERMINAL_HEIGHT}px`,
	      width: `${TERMINAL_WIDTH}px`,
        border: '1px solid #87ff8755',
        boxShadow: '0 0 200px #87ff8734',
      }}
    >
      <XTerm />
    </Box>
  )
}

export default Terminal;