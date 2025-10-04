import { Typography } from "@mui/material";
import { Link } from "@mui/material";

function Footer() {
  return (
    <Typography 
      sx={{
        fontFamily: 'Fira Mono',
        fontSize: '0.75rem',
        textAlign: 'center',
        mt: 1.5,
      }}
    >
      my github: <Link href="https://github.com/lucasopoka"> github.com/lucasopoka </Link>
      <br />
      &copy; lucas opoka {new Date().getFullYear()}
    </Typography>
  )
}

export default Footer;