import { useEffect } from 'react'
import Layout from '../components/Layout'
import Header from '../components/Header'
import SiteTitle from '../components/SiteTitle'
import AboveTerminal from '../components/AboveTerminal'
import Footer from '../components/Footer'
import WebVmEmbed from '../webvm/components/WebVmEmbed'

function ContactView() {
  useEffect(() => {
    document.title = 'contact'
  }, [])

  return (
    <Layout>
      <Header />

      <SiteTitle />

      <AboveTerminal>
        If you came that far, I hope you enjoyed my little corner in the inter
        webs. 🌐 <br />
        Both for the programming and the, I hope, abundant absurd! <br />
        <br />
        I do like to have fun with programming, after all, I'm just pressing
        them buttons to appease the machine gods! ⌨️ <br />
        <br />
        In case you found my work interesting, want to ask about my button
        pressing technique, or click together on some project, please do reach
        out! ✉️
      </AboveTerminal>

      <WebVmEmbed view="contact" />
      <Footer />
    </Layout>
  )
}

export default ContactView
