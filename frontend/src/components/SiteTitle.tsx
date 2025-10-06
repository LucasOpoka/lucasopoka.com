import { Typography } from "@mui/material";

function SiteTitle() {
  return (
    <Typography
      component="h1"
      sx={{ 
        fontSize: '1.6rem',
        color: 'secondary.main',
        fontWeight: '900',
        width: '100%',
        textAlign: 'left',
        mt: -0.5,
        mb: 2
      }}
    >
        &gt; lucasopoka.com
    </Typography>
  )
}

export default SiteTitle;