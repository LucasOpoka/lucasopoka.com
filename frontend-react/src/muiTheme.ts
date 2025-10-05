import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd7af',
    },
    secondary: {
      main: '#87ff87',
    },
    text: {
      primary: '#ffd7af',
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
