
import AbstractView from "./AbstractView.js";

export default class extends AbstractView
{
    constructor(params)
    {
        super(params);
    }

    async goToView()
    {
        var content = `
            <div id="top-nav">
				<ul>
					<li><a id="home_view" class="active" view-reference>
						home
					</a></li>
					<li><a id="pong_view" view-reference>
						pong
					</a></li>
					<li class="right"><a id="contact_view" view-reference>
						contact
					</a></li>
				</ul>
			</div>

			<h1 class="title">&gt; lucasopoka.com</h1>
			<img src="https://avatars.githubusercontent.com/u/83923012?v=4" class="logo self-portrait" alt="itz a me, Lucas" width="128" />
			<p class="content">
				Hi there, my name is Lucas and I spend most
				of my time speaking with computers!
				<br>
				<br>
				This site is a protfolio, where I share all the
				happy little programming accidents I got myself
				into :V
				<br>
				<br>
				Feel free to venture into the insides of my head
				served in the form of code and don't hesitate to
				reach out if at any point a &#128161 appears over
				you!
				<br>
			</p>

			<div id="separator"></div>
			<div class="terminal shadow" id="main-terminal"><code></code></div>
			<pre class="footer">
				my github: <a class="alt" href="https://github.com/lucasopoka">github.com/lucasopoka</a>
				<code>&copy; lucas opoka <script>document.write(new Date().getFullYear())</script></code>
			</pre>
        `;

        this.setTitle("home");
        await this.setContent(content);
    }
}
