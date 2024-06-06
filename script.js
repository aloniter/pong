const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 30; // Further increased ball radius
const ballImage1 = new Image();
const ballImage2 = new Image();
ballImage1.src = 'ball1.png';
ballImage2.src = 'ball2.png';
let currentBallImage = ballImage1;

const hitSound = new Audio('hit.mp3');

let player1Score = 0;
let player2Score = 0;

const player1 = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#00f',
  dy: 0
};

const player2 = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#f00',
  dy: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speed: 4,
  dx: 4,
  dy: 4,
  color: '#0f0'
};

function drawRect(x, y, width, height, color) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, image) {
  context.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
}

function movePaddle(paddle) {
  paddle.y += paddle.dy;
  if (paddle.y < 0) {
    paddle.y = 0;
  } else if (paddle.y + paddle.height > canvas.height) {
    paddle.y = canvas.height - paddle.height;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  if (ball.x - ball.radius < 0) {
    player2Score++;
    updateScore();
    resetBall();
  }

  if (ball.x + ball.radius > canvas.width) {
    player1Score++;
    updateScore();
    resetBall();
  }

  if (ball.x - ball.radius < player1.x + player1.width &&
      ball.y > player1.y &&
      ball.y < player1.y + player1.height) {
    ball.dx *= -1;
    increaseBallSpeed();
    switchBallImage();
    playHitSound();
  }

  if (ball.x + ball.radius > player2.x &&
      ball.y > player2.y &&
      ball.y < player2.y + player2.height) {
    ball.dx *= -1;
    increaseBallSpeed();
    switchBallImage();
    playHitSound();
  }
}

function switchBallImage() {
  currentBallImage = currentBallImage === ballImage1 ? ballImage2 : ballImage1;
}

function increaseBallSpeed() {
  ball.speed += 0.3;
  ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
  ball.dy = ball.dy > 0 ? ball.speed : -ball.speed;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 4;
  ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
  ball.dy = ball.dy > 0 ? ball.speed : -ball.speed;
}

function playHitSound() {
  hitSound.currentTime = 0;
  hitSound.play();
}

function updateScore() {
  document.getElementById('player1Score').textContent = player1Score;
  document.getElementById('player2Score').textContent = player2Score;
  if (player1Score >= 5) {
    declareWinner('Player 1');
  } else if (player2Score >= 5) {
    declareWinner('Player 2');
  }
}

function declareWinner(winner) {
  document.getElementById('winnerText').textContent = `${winner} Wins!`;
  document.getElementById('winner').style.display = 'block';
  canvas.style.display = 'none';
  document.getElementById('scoreBoard').style.display = 'none';
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  updateScore();
  document.getElementById('winner').style.display = 'none';
  canvas.style.display = 'block';
  document.getElementById('scoreBoard').style.display = 'block';
  resetBall();
}

function update() {
  movePaddle(player1);
  movePaddle(player2);
  moveBall();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
  drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
  drawBall(ball.x, ball.y, ball.radius, currentBallImage);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      player2.dy = -5;
      break;
    case 'ArrowDown':
      player2.dy = 5;
      break;
    case 'w':
      player1.dy = -5;
      break;
    case 's':
      player1.dy = 5;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      player2.dy = 0;
      break;
    case 'w':
    case 's':
      player1.dy = 0;
      break;
  }
});

ballImage1.onload = function() {
  loop();
};
