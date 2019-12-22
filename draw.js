let backgroundImg;
let birdSprite;
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
  birdSprite = loadImage('images/ball.png');
  pillarUp = loadImage('images/pillar.png');
  pillarDown = loadImage('images/pillar.png');
}

function setup() {
  let canvas = createCanvas(700, 400);
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
    let bird = new Bird();
    activeBalls[i] = bird;
    allBalls[i] = bird;
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
      bestBird.think(pipes);
      bestBird.update();
      for (let j = 0; j < pipes.length; j++) {
        if (pipes[j].hits(bestBird)) {
          resetGame();
          break;
        }
      }

      if (bestBird.bottomTop()) {
        resetGame();
      }
    } else {
      for (let i = activeBalls.length - 1; i >= 0; i--) {
        let bird = activeBalls[i];
        bird.think(pipes);
        bird.update();
        for (let j = 0; j < pipes.length; j++) {
          if (pipes[j].hits(activeBalls[i])) {
            activeBalls.splice(i, 1);
            break;
          }
        }

        if (bird.bottomTop()) {
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
    let tempBestBird = null;
    for (let i = 0; i < activeBalls.length; i++) {
      let s = activeBalls[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = activeBalls[i];
      }
    }

    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }
  } else {
    tempHighScore = bestBird.score;
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
    bestBird.show();
  } else {
    for (let i = 0; i < activeBalls.length; i++) {
      activeBalls[i].show();
    }
    if (activeBalls.length == 0) {
      nextGeneration();
    }
  }
}
