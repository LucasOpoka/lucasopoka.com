import { useEffect } from 'react'
import Header from '../components/Header'
import SiteTitle from '../components/SiteTitle'
import AboveTerminal from '../components/AboveTerminal'


function ContactView() {

  useEffect(() => {
    document.title = 'contact'
  }, [])

  return (
    <>
      
      <Header />

      <SiteTitle />
  
      <AboveTerminal>
        Can this really be a Linux running in your browser? <br />
        The answer is yes, yes it can! <br />
        <br />
        Use it as any other Linux, create directories, edit files, run programs, etc.
        <br />
        <br />
        Check the CPU and disk monitoring in under the terminal. <br />
        Your data persists between sessions using IndexedDB.
      </AboveTerminal>
      
    </>
  )
}

export default ContactView