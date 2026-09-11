import { useSearchParams } from 'react-router-dom'
import { Box } from '@mui/material'
import WebVM from './WebVM'
import { DEFAULT_VIEW, isViewName } from '../viewConfigs'

// Rendered only inside the <iframe> that WebVmEmbed points at - no header,
// nav, or page chrome. A view change navigates the iframe to a fresh boot,
// so the browser tears down the old realm atomically (like a full reload).
function WebVmFrame() {
  const [searchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const view = isViewName(requestedView) ? requestedView : DEFAULT_VIEW

  return (
    // No background (index.html/styles.css paint it). height: 100vh here
    // equals the iframe's own fixed height exactly, so this Box always
    // fills it precisely - no sub-pixel gap for the background split to miss.
    <Box sx={{ height: '100vh' }}>
      <WebVM view={view} />
    </Box>
  )
}

export default WebVmFrame
