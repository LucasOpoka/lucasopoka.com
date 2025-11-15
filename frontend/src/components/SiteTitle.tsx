import { Typography, Box } from "@mui/material";

function SiteTitle() {
  return (
    <Typography
      component="h1"
      sx={{ 
        fontSize: '1.6rem',
        fontWeight: '900',
        width: '100%',
        textAlign: 'left',
        mt: -0.5,
        mb: 2,
        color: 'secondary.main'
      }}
    >
      <Box
        component="span"
        sx={{
          background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 5%, rgba(253, 29, 29, 1) 25%, rgba(252, 176, 69, 1) 50%, rgba(30, 255, 0, 1) 75%, rgba(8, 8, 204, 1) 95%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
          &gt; lucasopoka.com
      </Box>
    </Typography>
  )
}

export default SiteTitle;