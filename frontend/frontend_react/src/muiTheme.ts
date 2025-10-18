import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00CDAC',
    },
    secondary: {
      main: '#00ff00',
    },
    text: {
      primary: '#00CDAC',
      secondary: '#5fffff',
    },
  },
  typography: {
    fontFamily: '"Fira Mono", monospace',
    fontSize: 12,
    fontWeightRegular: 500,
  },
})

export default muiTheme
