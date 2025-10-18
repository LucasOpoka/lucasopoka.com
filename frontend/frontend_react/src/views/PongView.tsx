import { useEffect } from 'react'
import Header from '../components/Header'
import SiteTitle from '../components/SiteTitle'
import AboveTerminal from '../components/AboveTerminal'
import Layout from '../components/Layout'

function PongView() {

  useEffect(() => {
    document.title = 'pong'
  }, [])

  return (
    <Layout>
      
      <Header />

      <SiteTitle />
  
      <AboveTerminal>
        Siencists have long determined that Pong is a game 
        that mainly consists of bouncing a ball between two paddles.
        <br />
        <br />
        Some would say it's like tango, since it requires two
        to make the magic happen! On the other hand, its unlike tango,
        since you don't have to move your ass.
        <br />
        <br />
        Please enjoy a session of Pong below. I hope it will remind you of
        the simplier more serene times, when this classic was
        the pinnacle of entertainment.
      </AboveTerminal>
      
    </Layout>
  )
}

export default PongView