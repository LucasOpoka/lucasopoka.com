import { useSearchParams } from 'react-router-dom'
import { Box } from '@mui/material'
import WebVM from './WebVM'
import { DEFAULT_VIEW, isViewName } from '../viewConfigs'

// Rendered only inside the <iframe> that WebVmEmbed points at - no header,
// nav, or page chrome. Isolating the VM in its own browsing context means a
// view change can just navigate the iframe to a fresh boot: the browser
// tears down the old realm (worker, WASM memory, any in-flight work) atomically,
// the same guarantee a full page reload gives, without reloading the whole site.
function WebVmFrame() {
  const [searchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const view = isViewName(requestedView) ? requestedView : DEFAULT_VIEW

  return (
    // No background here: index.html/styles.css already paint body with the
    // right background for this route (see the --page-bg gradient trick in
    // index.html) - restating it here would just be a second copy to keep
    // in sync.
    //
    // Deliberately no minHeight: 100vh - that would stretch this Box to
    // fill the iframe regardless of actual content height, silently
    // absorbing any gap between real content and WebVmEmbed's fixed iframe
    // height (TERMINAL_HEIGHT + TERMINAL_FOOTER_HEIGHT) by pushing the
    // site's real Footer down with no visible sign anything's wrong. Sized
    // to natural content height instead, so if the footer ever grows past
    // that estimate, it shows up as a visible scrollbar/clip inside the
    // terminal box - a symptom you can actually see and go fix the
    // constant for - rather than a silent layout shift on the outer page.
    <Box>
      <WebVM view={view} />
    </Box>
  )
}

export default WebVmFrame
