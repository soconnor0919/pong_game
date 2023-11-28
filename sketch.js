let ball;
let leftPaddle;
let rightPaddle;
let leftScore = 0;
let rightScore = 0;
let gameSpeed = 1.5;

let isGameOver = false;

function setup() {
  createCanvas(800, 600);
  textSize(24);
  ball = new Ball();
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
}

function draw() {
  background(220);

  if (leftScore >= 10 || rightScore >= 10) {
    isGameOver = true;
  }

  if (isGameOver) {
    displayGameOver();
  } else {
    // Draw paddles
    leftPaddle.show();
    rightPaddle.show();

    // Move paddles
    leftPaddle.move();
    rightPaddle.move();

    // Draw ball
    ball.show();
    ball.move();
    ball.checkPaddleCollision(leftPaddle);
    ball.checkPaddleCollision(rightPaddle);

    // Update scores
    fill(0);
    textSize(32);
    text(leftScore, width / 4, 40);
    text(rightScore, 3 * width / 4, 40);

    // Check for scoring
    if (ball.offScreen()) {
      if (ball.x < 0) {
        rightScore++;
      } else {
        leftScore++;
      }
      gameSpeed += 0.2; // Increment game speed after a point is scored
      resetGame();
    }
  }
}

function resetGame() {
  ball.reset();
  leftPaddle.reset();
  rightPaddle.reset();
}

function displayGameOver() {
  fill(255, 0, 0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text('Game Over!', width / 2, height / 2 - 40);
  textSize(32);
  text('Your Score:', width / 2, height / 2 + 20);
  text(leftScore, width / 2 - 20, height / 2 + 60);
  text(rightScore, width / 2 + 20, height / 2 + 60);
  textSize(24);
  text('Click to play again', width / 2, height / 2 + 100);
}

function mousePressed() {
  if (isGameOver) {
    isGameOver = false;
    leftScore = 0;
    rightScore = 0;
    gameSpeed = 1.5;
    resetGame();
  }
}

class Paddle {
  constructor(isLeft) {
    this.w = 10;
    this.h = 80;
    this.y = height / 2 - this.h / 2;
    this.isLeft = isLeft;
    this.speed = 6;
  }

  show() {
    fill(0);
    noStroke();
    rect(this.isLeft ? 0 : width - this.w, this.y, this.w, this.h);
  }

  move() {
    if (this.isLeft) {
      this.y = mouseY - this.h / 2;
    } else {
      // Simple logic for the right paddle
      let target = ball.y - this.h / 2;
      this.y += (target - this.y) * 0.14;
    }

    // Constrain paddle movement within the canvas
    this.y = constrain(this.y, 0, height - this.h);
  }

  reset() {
    this.y = height / 2 - this.h / 2;
  }
}

class Ball {
  constructor() {
    this.reset();
  }

  show() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  move() {
    this.x += this.xSpeed * gameSpeed;
    this.y += this.ySpeed * gameSpeed;

    // Bounce off the top and bottom edges
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.diameter = 20;
    this.xSpeed = random(3, 5) * (random() > 0.5 ? 1 : -1);
    this.ySpeed = random(2, 4) * (random() > 0.5 ? 1 : -1);
  }

  offScreen() {
    return this.x < 0 || this.x > width;
  }

  checkPaddleCollision(paddle) {
    let halfPaddleHeight = paddle.h / 2;
    let halfPaddleWidth = paddle.w / 2;

    // Check if the ball is within the vertical bounds of the paddle
    if (this.y + this.diameter / 2 > paddle.y && this.y - this.diameter / 2 < paddle.y + paddle.h) {
      // Check if the ball is within the horizontal bounds of the left paddle
      if (paddle.isLeft && this.x - this.diameter / 2 < paddle.w) {
        this.xSpeed *= -1;
      }
      // Check if the ball is within the horizontal bounds of the right paddle
      else if (!paddle.isLeft && this.x + this.diameter / 2 > width - paddle.w) {
        this.xSpeed *= -1;
      }
    }
  }
}
