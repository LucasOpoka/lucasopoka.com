
export default class
{
    constructor(params)
    {
        this.params = params;
    }

    setTitle(title)
    {
        document.title = title;
    }

    async setContent(content)
    {
        document.querySelector("#container").style.opacity = 0;

        await new Promise(r => setTimeout(r, 400));

        document.querySelector("#container").innerHTML = content;
        document.querySelector("#container").style.opacity = 1;
    }

    async goToView()
    {
        return;
    }

    async goToGameView()
    {
        var content = `<canvas width=100% height=100% id="pong" tabindex="-1"></canvas>`;

        await this.setContent(content);
    }
}
