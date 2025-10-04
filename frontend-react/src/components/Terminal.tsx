import { Box } from "@mui/material";

function Terminal() {
  return (
    <Box
      sx={{
        mt: 2,
        height: '420px',
	      width: '800px',
        border: '1px solid #87ff8755',
        boxShadow: '0 0 200px #87ff8734',
      }}
    >
      <code></code>
    </Box>
  )
}

export default Terminal;