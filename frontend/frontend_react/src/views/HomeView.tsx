import { useEffect } from 'react'
import Layout from '../components/Layout'
import Header from '../components/Header'
import SiteTitle from '../components/SiteTitle'
import AboveTerminal from '../components/AboveTerminal'
import WebVM from '../webvm/components/WebVM'
import Footer from '../components/Footer'


function HomeView() {
  
  useEffect(() => {
    document.title = 'home'
  }, [])

  return (
    <Layout>
      
      <Header />

      <SiteTitle />
  
      <AboveTerminal>
        Hi there, my name is Lucas and I spend most
        of my time speaking with computers!
        <br />
        <br />
        This site is a protfolio, where I share all the
        happy little programming accidents I got myself
        into :V
        <br />
        <br />
        Feel free to venture into the insides of my mind
        served in the form of code and don't hesitate to
        reach out if any of my work makes a 💡 appear over
        your head!
      </AboveTerminal>

      <WebVM />
      
      <Footer />
      
    </Layout>
  )
}

export default HomeView


