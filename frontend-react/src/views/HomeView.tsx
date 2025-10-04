import { useEffect } from 'react'
import './HomeView.css'

const HomeView: React.FC = () => {
  useEffect(() => {
    document.title = 'home'
  }, [])

  return (
    <div className="home-view">
      <h1 className="title">&gt; lucasopoka.com</h1>
      <img 
        src="https://avatars.githubusercontent.com/u/83923012?v=4" 
        className="logo self-portrait" 
        alt="itz a me, Lucas" 
        width="128" 
      />
      <p className="content">
        Hi there, my name is Lucas and I spend most
        of my time speaking with computers!
        <br />
        <br />
        This site is a protfolio, where I share all the
        happy little programming accidents I got myself
        into :V
        <br />
        <br />
        Feel free to venture into the insides of my head
        served in the form of code and don't hesitate to
        reach out if at any point a &#128161; appears over
        you!
        <br />
      </p>

      <div id="separator"></div>
      <div className="terminal shadow" id="main-terminal">
        <code></code>
      </div>
      <pre className="footer">
        my github: <a className="alt" href="https://github.com/lucasopoka">github.com/lucasopoka</a>
        <code>&copy; lucas opoka {new Date().getFullYear()}</code>
      </pre>
    </div>
  )
}

export default HomeView


