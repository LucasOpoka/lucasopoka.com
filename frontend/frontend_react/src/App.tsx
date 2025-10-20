import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import muiTheme from './muiTheme'
import AppRoutes from './AppRoutes/AppRoutes'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Layout>
          <AppRoutes />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App


