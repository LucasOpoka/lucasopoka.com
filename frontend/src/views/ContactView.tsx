import { useEffect } from 'react'
import Layout from '../components/Layout'
import Header from '../components/Header'
import SiteTitle from '../components/SiteTitle'
import AboveTerminal from '../components/AboveTerminal'
import Footer from '../components/Footer'
import WebVM from '../webvm/components/WebVM'


function ContactView() {

  useEffect(() => {
    document.title = 'contact'
  }, [])

  return (
    <Layout>
      
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
      
      <WebVM />
      <Footer />
    </Layout>
  )
}

export default ContactView