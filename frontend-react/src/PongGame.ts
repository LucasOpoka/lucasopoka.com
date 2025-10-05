/* -------------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                                                                                                              */
/*                                   ██████╗  ██████╗ ███╗   ██╗ ██████╗      ██████╗  █████╗ ███╗   ███╗███████╗                               */
/*                                   ██╔══██╗██╔═══██╗████╗  ██║██╔════╝     ██╔════╝ ██╔══██╗████╗ ████║██╔════╝                               */
/*                                   ██████╔╝██║   ██║██╔██╗ ██║██║  ███╗    ██║  ███╗███████║██╔████╔██║█████╗                                 */
/*                                   ██╔═══╝ ██║   ██║██║╚██╗██║██║   ██║    ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝                                 */
/*                                   ██║     ╚██████╔╝██║ ╚████║╚██████╔╝    ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗                               */
/*                                   ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝                               */                                                           
/*                                                                                                                                              */
/* -------------------------------------------------------------------------------------------------------------------------------------------- */

// Pong game types
export interface PongBall {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  resetting: boolean;
  speed: number;
  dx: number;
  dy: number;
  color: string;
}

export interface PongPlayer {
  name: string;
  side: 'left' | 'right';
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dy: number;
  color: string;
}

export interface PongGameData {
  game_type: string;
  fps: number;
  delay: number;
  paused: boolean;
  end: boolean;
  score: [number, number];
  max_score: number;
  balls: PongBall[];
  players: PongPlayer[];
  grid: number;
  paddleHeight: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  max_y: number;
}

export class PongGame {
  private gameData: PongGameData;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.gameData = this.initializeGameData(canvas);
    this.setupEventListeners();
  }

  private initializeGameData(canvas: HTMLCanvasElement): PongGameData {
    const gameData: PongGameData = {
      game_type: 'pong',
      fps: 25,
      delay: 1000 / 25,
      paused: false,
      end: false,
      score: [0, 0],
      max_score: 5,
      balls: [],
      players: [],
      grid: 15,
      paddleHeight: 0,
      canvas,
      context: canvas.getContext('2d')!,
      max_y: 0
    };

    gameData.paddleHeight = gameData.grid * 5;
    gameData.max_y = gameData.canvas.height - gameData.paddleHeight;

    return gameData;
  }

  public async startGame(): Promise<void> {
    this.createPongBall('ball', 0.5, 0.5, 7, 'left');
    this.createPongPlayer("playerLeft", 'left', 0.5, 6, 'w', 's');
    this.createPongPlayer("playerRight", 'right', 0.5, 6, 'o', 'l');

    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    }).then(() => this.gameLoop());
  }

  private async gameLoop(): Promise<void> {
    this.gameData.canvas.focus();

    if (!this.gameData.paused) {
      if (this.gameData.balls[0].resetting)
      {
        // reset game
        this.resetPongGame();

        // draw score
        this.drawPongBackground();

        // wait
        await new Promise(r => setTimeout(r, 1500));

        // unlock
        this.gameData.balls[0].resetting = false;
      } else {
        // move players
        this.gameData.players.forEach(player => this.movePongPlayer(player));

        // move balls
        this.gameData.balls.forEach(ball => this.movePongBall(ball));

        // check collisions
        this.gameData.players.forEach(player => this.handlePongPlayers(player));

        // draw frame
        this.drawPongFrame();
      }
    }

    // end or new frame
    if (this.gameData.end) {
      return Promise.resolve();
    } else {
      await new Promise(r => setTimeout(r, this.gameData.delay));
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  private createPongBall(name: string, x: number, y: number, speed: number, left: string): void {
    const ball: PongBall = {
      name,
      x: this.gameData.canvas.width * x,
      y: this.gameData.canvas.height * y,
      width: this.gameData.grid,
      height: this.gameData.grid,
      resetting: false,
      speed,
      dx: (left === 'left' ? speed : -speed),
      dy: speed,
      color: '#2aa1b3'
    };

    this.gameData.balls.push(ball);
  }

  private createPongPlayer(name: string, side: 'left' | 'right', startY: number, speed: number, up: string, down: string): void {
    const player: PongPlayer = {
      name,
      side,
      x: (side === "left" ? this.gameData.grid * 0 : this.gameData.canvas.width - this.gameData.grid),
      y: (this.gameData.canvas.height - this.gameData.paddleHeight) * startY,
      width: this.gameData.grid,
      height: this.gameData.paddleHeight,
      speed,
      dy: 0,
      color: '#33d17a'
    };

    this.addPongPlayerListeners(player, up, down);
    this.gameData.players.push(player);
  }

  private movePongPlayer(player: PongPlayer): void {
    if ((player.y + player.dy < 0) || (player.y + player.dy > this.gameData.max_y)) {
      if (player.dy > 0) {
        player.y = this.gameData.max_y;
      } else {
        player.y = 0;
      }
    } else {
      player.y = player.y + player.dy;
    }
  }

  private movePongBall(ball: PongBall): void {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y < 0 || ball.y > this.gameData.canvas.height - this.gameData.grid) {
      ball.y = (ball.y < 0 ? 0 : this.gameData.canvas.height - this.gameData.grid);
      ball.dy *= -1;
    }

    if ((ball.x < 0 || ball.x > this.gameData.canvas.width) && !ball.resetting) {
      ball.resetting = true;
      if (ball.x > this.gameData.canvas.width) {
        this.gameData.score[0]++;
      } else {
        this.gameData.score[1]++;
      }
    }
  }

  private handlePongPlayers(player: PongPlayer): void {
    this.gameData.balls.forEach(ball => this.handlePongCollision(player, ball));
  }

  private handlePongCollision(player: PongPlayer, ball: PongBall): void {
    if (ball.resetting) return;

    if ((ball.x < player.x + player.width) && 
        (ball.x + ball.width > player.x) && 
        (ball.y < player.y + player.height) && 
        (ball.y + ball.height > player.y)) {
      ball.dx *= -1;
      ball.x = player.x + (player.side === "left" ? player.width : -player.width);
    }
  }

  private drawPongFrame(): void {
    // draw background
    this.drawPongBackground();

    // draw players
    this.gameData.players.forEach(player => this.drawPongObject(player));

    // draw balls
    this.gameData.balls.forEach(ball => this.drawPongObject(ball));
  }

  private drawPongBackground(): void {
    const ctx = this.gameData.context;
    const canvas = this.gameData.canvas;

    // reset background
    ctx.fillStyle = '#002b36';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw score
    if (this.gameData.balls[0].resetting) {
      ctx.textAlign = 'center';
      ctx.font = '150px "Jersey 10", Arial, sans-serif';
      ctx.fillStyle = '#2aa1b3';
      
      // Check if Jersey 10 font is loaded by measuring text with a known font
      const testFont = '150px Arial, sans-serif';
      ctx.font = testFont;
      const testWidth = ctx.measureText('0').width;
      
      ctx.font = '150px "Jersey 10", Arial, sans-serif';
      const jerseyWidth = ctx.measureText('0').width;
      
      // Only draw if Jersey 10 is loaded (different width than Arial)
      if (Math.abs(jerseyWidth - testWidth) > 1) {
        ctx.fillText(`${this.gameData.score[0]}     ${this.gameData.score[1]}`, canvas.width / 2, canvas.height * 0.6);
      }
    }
  }

  private drawPongObject(object: PongBall | PongPlayer): void {
    this.gameData.context.beginPath();
    this.gameData.context.fillStyle = object.color;
    this.gameData.context.fillRect(object.x, object.y, object.width, object.height);
  }

  private addPongPlayerListeners(player: PongPlayer, up: string, down: string): void {
    const keydownHandler = (e: KeyboardEvent) => this.pongPlayerKeydownListener(e, player, up, down);
    const keyupHandler = (e: KeyboardEvent) => this.pongPlayerKeyupListener(e, player, up, down);

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);
  }

  private pongPlayerKeydownListener(e: KeyboardEvent, player: PongPlayer, up: string, down: string): void {
    if (e.key === up) {
      player.dy = -player.speed;
    } else if (e.key === down) {
      player.dy = player.speed;
    }
  }

  private pongPlayerKeyupListener(e: KeyboardEvent, player: PongPlayer, up: string, down: string): void {
    if (e.key === up || e.key === down) {
      player.dy = 0;
    }
  }

  private resetPongGame(): void {
    const ball = this.gameData.balls[0];
    const playerLeft = this.gameData.players[0];
    const playerRight = this.gameData.players[1];

    if (this.gameData.score[0] >= this.gameData.max_score || this.gameData.score[1] >= this.gameData.max_score) {
      this.gameData.end = true;
    } else {
      ball.x = this.gameData.canvas.width / 2;
      ball.y = this.gameData.canvas.height / 2;
      playerLeft.y = this.gameData.canvas.height / 2 - this.gameData.paddleHeight / 2;
      playerRight.y = this.gameData.canvas.height / 2 - this.gameData.paddleHeight / 2;
    }
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => this.pauseListener(e));
  }

  private pauseListener(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.gameData.paused = !this.gameData.paused;
    }
  }

  public stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
