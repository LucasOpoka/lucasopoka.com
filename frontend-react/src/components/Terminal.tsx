import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { PongGame } from "../PongGame";

const TERMINAL_WIDTH = 800;
const TERMINAL_HEIGHT = 420;
const BORDER_WIDTH = 7.5;
const BORDER_HEIGHT = 15;

interface TerminalProps {
  showGame?: string;
}

function Terminal({ showGame = "" }: TerminalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<PongGame | null>(null);

  useEffect(() => {
    if (showGame === "pong" && canvasRef.current) {
      const canvas = canvasRef.current;
      // Account for the custom borders
      canvas.width = TERMINAL_WIDTH - 2 * BORDER_WIDTH;
      canvas.height = TERMINAL_HEIGHT - 2 * BORDER_HEIGHT;
      
      // Create and start the game
      gameRef.current = new PongGame(canvas);
      gameRef.current.startGame();
    }
  }, [showGame]);

  return (
    <Box
      sx={{
        mt: 2,
        height: `${TERMINAL_HEIGHT}px`,
	      width: `${TERMINAL_WIDTH}px`,
        border: '1px solid #87ff8755',
        boxShadow: '0 0 200px #87ff8734',
        ...(showGame && {
          outlineOffset: '-7.5px',
	        outline: '3px solid #33d17a',
	        borderLeft: `${BORDER_WIDTH}px solid #33d17a`,
	        borderRight: `${BORDER_WIDTH}px solid #33d17a`,
	        borderTop: `${BORDER_HEIGHT}px solid #33d17a`,
	        borderBottom: `${BORDER_HEIGHT}px solid #33d17a`,
        }),
      }}
    >
      {showGame && (
        <canvas
          ref={canvasRef}
        />
      )}
    </Box>
  )
}

export default Terminal;