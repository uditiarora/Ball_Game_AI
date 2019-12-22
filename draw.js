let backgroundImg;
let ballSprite;
let pillarUp;
let pillarDown;
let totalPopulation = 500;
let activeBalls = [];
let allBalls = [];
let pipes = [];
let counter = 0;

let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;
let highScore = 0;
let runBest = false;
let runBestButton;

function preload(){
  backgroundImg = loadImage('images/background.jpg');
  ballSprite = loadImage('images/ball.png');
  pillarUp = loadImage('images/pillar.png');
  pillarDown = loadImage('images/pillar.png');
}

function setup() {
  let canvas = createCanvas(700, 400);
  canvas.style('border','5px solid #64ffda');
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
  canvas.parent('canvascontainer');
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);

  for (let i = 0; i < totalPopulation; i++) {
    let ball = new Ball();
    activeBalls[i] = ball;
    allBalls[i] = ball;
  }
}

function toggleState() {
  runBest = !runBest;
  if (runBest) {
    resetGame();
    runBestButton.html('Continue Training');
  } else {
    nextGeneration();
    runBestButton.html('Run Best');
  }
}


function draw() {
  background(backgroundImg);
  let cycles = speedSlider.value();
  speedSpan.html(cycles);
  for (let n = 0; n < cycles; n++) {
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    if (runBest) {
      bestBall.think(pipes);
      bestBall.update();
      for (let j = 0; j < pipes.length; j++) {
        if (pipes[j].hits(bestBall)) {
          resetGame();
          break;
        }
      }

      if (bestBall.bottomTop()) {
        resetGame();
      }
    } else {
      for (let i = activeBalls.length - 1; i >= 0; i--) {
        let ball = activeBalls[i];
        ball.think(pipes);
        ball.update();
        for (let j = 0; j < pipes.length; j++) {
          if (pipes[j].hits(activeBalls[i])) {
            activeBalls.splice(i, 1);
            break;
          }
        }

        if (ball.bottomTop()) {
          activeBalls.splice(i, 1);
        }

      }
    }

    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  let tempHighScore = 0;
  if (!runBest) {
    let tempBestBall = null;
    for (let i = 0; i < activeBalls.length; i++) {
      let s = activeBalls[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBall = activeBalls[i];
      }
    }

    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBall = tempBestBall;
    }
  } else {
    tempHighScore = bestBall.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }

  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestBall.show();
  } else {
    for (let i = 0; i < activeBalls.length; i++) {
      activeBalls[i].show();
    }
    if (activeBalls.length == 0) {
      nextGeneration();
    }
  }
}
