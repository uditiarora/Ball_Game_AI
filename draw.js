let backgroundImg;
let ballImg;
let pillarUp;
let pillarDown;
let totalBalls = 500;
let activeBalls = [];
let allBalls = [];
let pillars = [];
let counter = 0;
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

let highScore = 0;
let runBest = false;
let runBestButton;


function preload(){
    backgroundImg = loadImage('assets/background.jpg');
    birdSprite = loadImage('assets/bird1.png');
    pillarUp = loadImage('assets/pipebg.png');
    pillarBottom = loadImage('assets/pipebg.png');
  }
  
  function setup() {
    let canvas = createCanvas(700, 400);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
    canvas.parent('canvascontainer');
  
    // Access the interface elements
    speedSlider = select('#speedSlider');
    speedSpan = select('#speed');
    highScoreSpan = select('#hs');
    allTimeHighScoreSpan = select('#ahs');
    runBestButton = select('#best');
    runBestButton.mousePressed(toggleState);
  
    // Create a population
    for (let i = 0; i < totalPopulation; i++) {
      let bird = new Bird();
      activeBalls[i] = bird;
      allBalls[i] = bird;
    }
  }
  
  // Toggle the state of the simulation
  function toggleState() {
    runBest = !runBest;
    // Show the best bird
    if (runBest) {
      resetGame();
      runBestButton.html('continue training');
      // Go train some more
    } else {
      nextGeneration();
      runBestButton.html('Run Best');
    }
  }
  
  
  function draw() {
    background(backgroundImg);
  
    // Should we speed up cycles per frame
    let cycles = speedSlider.value();
    speedSpan.html(cycles);
  
  
    // How many times to advance the game
    for (let n = 0; n < cycles; n++) {
      // Show all the pillars
      for (let i = pillars.length - 1; i >= 0; i--) {
        pillars[i].update();
        if (pillars[i].offscreen()) {
          pillars.splice(i, 1);
        }
      }
      // Are we just running the best bird
      if (runBest) {
        bestBird.think(pillars);
        bestBird.update();
        for (let j = 0; j < pillars.length; j++) {
          // Start over, bird hit pipe
          if (pillars[j].collide(bestBird)) {
            resetGame();
            break;
          }
        }
  
        if (bestBird.bottomTop()) {
          resetGame();
        }
        // Or are we running all the active birds
      } else {
        for (let i = activeBalls.length - 1; i >= 0; i--) {
          let bird = activeBalls[i];
          // Bird uses its brain!
          bird.think(pillars);
          bird.update();
  
          // Check all the pillars
          for (let j = 0; j < pillars.length; j++) {
            // It's hit a pipe
            if (pillars[j].collide(activeBalls[i])) {
              // Remove this bird
              activeBalls.splice(i, 1);
              break;
            }
          }
  
          if (bird.bottomTop()) {
            activeBalls.splice(i, 1);
          }
  
        }
      }
  
      // Add a new pipe every so often
      if (counter % 75 == 0) {
        pillars.push(new Pipe());
      }
      counter++;
    }
  
    // What is highest score of the current population
    let tempHighScore = 0;
    // If we're training
    if (!runBest) {
      // Which is the best bird?
      let tempBestBird = null;
      for (let i = 0; i < activeBalls.length; i++) {
        let s = activeBalls[i].score;
        if (s > tempHighScore) {
          tempHighScore = s;
          tempBestBird = activeBalls[i];
        }
      }
  
      // Is it the all time high scorer?
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
        bestBird = tempBestBird;
      }
    } else {
      // Just one bird, the best one so far
      tempHighScore = bestBird.score;
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
      }
    }
  
    // Update DOM Elements
    highScoreSpan.html(tempHighScore);
    allTimeHighScoreSpan.html(highScore);
  
    // Draw everything!
    for (let i = 0; i < pillars.length; i++) {
      pillars[i].showPillar();
    }
  
    if (runBest) {
      bestBird.showPillar();
    } else {
      for (let i = 0; i < activeBalls.length; i++) {
        activeBalls[i].showPillar();
      }
      // If we're out of birds go to the next generation
      if (activeBalls.length == 0) {
        nextGeneration();
      }
    }
  }
  