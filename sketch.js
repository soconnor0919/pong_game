// Variables to store game elements and scores
let ball;
let leftPaddle;
let rightPaddle;
let leftScore = 0;
let rightScore = 0;
let gameSpeed = 1.5; // Initial game speed

let isGameOver = false; // Flag to indicate if the game is over

// Set up the canvas and initialize game objects
function setup() {
  createCanvas(800, 600); // Create a canvas with dimensions 800x600 pixels
  textSize(24); // Set the default text size
  ball = new Ball(); // Create a new ball object
  leftPaddle = new Paddle(true); // Create a left paddle object
  rightPaddle = new Paddle(false); // Create a right paddle object
}

// Main game loop
function draw() {
  background(220); // Set the background color

  // Check if either player has reached the winning score
  if (leftScore >= 10 || rightScore >= 10) {
    isGameOver = true;
  }

  // Display game over screen if the game is over
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

    // Update scores on the screen
    fill(0);
    textSize(32);
    text(leftScore, width / 4, 40);
    text(rightScore, 3 * width / 4, 40);

    // Check for scoring and update game speed
    if (ball.offScreen()) {
      if (ball.x < 0) {
        rightScore++;
      } else {
        leftScore++;
      }
      gameSpeed += 0.2; // Increment game speed after a point is scored
      resetGame(); // Reset game state for the next round
    }
  }
}

// Function to reset the game state
function resetGame() {
  ball.reset();
  leftPaddle.reset();
  rightPaddle.reset();
}

// Function to display the game over screen
function displayGameOver() {
  fill(255, 0, 0); // Set text color to red
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

// Function to handle mouse click event
function mousePressed() {
  if (isGameOver) {
    // Reset game state if the game is over
    isGameOver = false;
    leftScore = 0;
    rightScore = 0;
    gameSpeed = 1.5;
    resetGame();
  }
}

// Paddle class representing the left and right paddles
class Paddle {
  constructor(isLeft) {
    this.w = 10; // Paddle width
    this.h = 80; // Paddle height
    this.y = height / 2 - this.h / 2; // Initial y-coordinate
    this.isLeft = isLeft; // Flag to determine if it's the left paddle
    this.speed = 6; // Paddle movement speed
  }

  // Display the paddle on the canvas
  show() {
    fill(0); // Set fill color to black
    noStroke();
    rect(this.isLeft ? 0 : width - this.w, this.y, this.w, this.h);
  }

  // Move the paddle based on user input (for the left paddle) or ball position (for the right paddle)
  move() {
    if (this.isLeft) {
      this.y = mouseY - this.h / 2; // Follow the mouse for the left paddle
    } else {
      // Simple logic for the right paddle to track the ball
      let target = ball.y - this.h / 2;
      this.y += (target - this.y) * 0.14;
    }

    // Constrain paddle movement within the canvas
    this.y = constrain(this.y, 0, height - this.h);
  }

  // Reset the paddle position to the center
  reset() {
    this.y = height / 2 - this.h / 2;
  }
}

// Ball class representing the game ball
class Ball {
  constructor() {
    this.reset(); // Initialize ball properties
  }

  // Display the ball on the canvas
  show() {
    fill(0); // Set fill color to black
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  // Move the ball based on its speed
  move() {
    this.x += this.xSpeed * gameSpeed;
    this.y += this.ySpeed * gameSpeed;

    // Bounce off the top and bottom edges
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1; // Reverse the y-speed to bounce the ball
    }
  }

  // Reset the ball position and speed
  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.diameter = 20; // Ball diameter
    this.xSpeed = random(3, 5) * (random() > 0.5 ? 1 : -1); // Random initial x-speed
    this.ySpeed = random(2, 4) * (random() > 0.5 ? 1 : -1); // Random initial y-speed
  }

  offScreen() {
    return this.x < 0 || this.x > width;
  }

  // Check for collisions with paddles and change direction accordingly
  checkPaddleCollision(paddle) {
    let halfPaddleHeight = paddle.h / 2;
    let halfPaddleWidth = paddle.w / 2;

    // Check if the ball is within the vertical bounds of the paddle
    if (this.y + this.diameter / 2 > paddle.y && this.y - this.diameter / 2 < paddle.y + paddle.h) {
      // Check if the ball is within the horizontal bounds of the left paddle
      if (paddle.isLeft && this.x - this.diameter / 2 < paddle.w) {
        this.xSpeed *= -1; // Reverse the x-speed to bounce the ball
      }
      // Check if the ball is within the horizontal bounds of the right paddle
      else if (!paddle.isLeft && this.x + this.diameter / 2 > width - paddle.w) {
        this.xSpeed *= -1; // Reverse the x-speed to bounce the ball
      }
    }
  }
}
