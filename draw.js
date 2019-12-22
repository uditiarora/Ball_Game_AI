let background;
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


function setup(){
    let canvas = createCanvas(700,400);
    let x = (windowWidth - width)/2;
    let y = (windowHeight - height)/2;
    canvas.position(x,y);
    canvas.parent('canvascontainer');

    speedSlider = select('#speedSlider');
    speedSpan = select('#speed');
    highScoreSpan = select('#hs');
    allTimeHighScoreSpan = select('#best');
    runBestButton.mousePressed(toggleState);

    for(let i = 0;i<totalBalls;i++){
        let ball = new Ball();
        activeBalls[i] = ball;
        allBalls[i] = ball
    }



}

function toggleState() {
    runBest = !runBest;
    if(runBest){
        resetGame();
        runBestButton.html('Continue Training');

    }
    else{
        nextGeneration();
        runBestButton.html('Run Best')
    }
}

function preload(){
    background = loadImage('images/background.jpg');
    ballImg = loadImage('images/ball.png');
    pillarUp = loadImage('images/pillar.png');
    pillarDown = loadImage('images/pillar.png');
}


