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



function preload(){
    backgroundImg = loadImage('images/background.jpg');
    ballImg = loadImage('images/ball.png');
    pillarUp = loadImage('images/pillar.png');
    pillarDown = loadImage('images/pillar.png');
}


function draw(){
    background(backgroundImg);

    let cycles = speedSlider.value();
    speedSpan.html(cycles);

    for(let n = 0;n < cycles;n++){
        for(let i = pillars.length - 1;i>=0;i--){
            pillars[i].update();
            if(pillars[i].offscreen()){
                pillars.splice(i,1);
            }
        }
        if(runBest){
            bestBall.think(pillars);
            bestBall.update();
            for(let j = 0;j<pillars.length;j++){
                if(pillars[j].collide(bestBall)){
                    resetGame();
                    break;
                }
            }

            if(bestBall.bottomTop()){
                resetGame();
            }
        }
        else{
            for(let i = activeBalls.length-1;i>=0;i--){
                let ball = activeBalls[i];
                ball.think(pillars);
                ball.update();

                for(let j=0; j<pipes.length;j++){
                    if(pillars[j].collide(activeBalls[i])){
                        activeBalls.splice(i,1);
                        break;
                    }
                }

                if(ball.bottomTop()){
                    activeBalls.splice(i,1);
                }
            }
        }

        if(counter%75 == 0){
            pillars.push(new Pillar());
        }
        counter++;

    }


    //highest score for current instance
    let tempHighScore = 0;
    if(!runBest){
        let tempBestBall = null;
        for(let i=0;i<activeBalls.length;i++){
            let score =  activeBalls[i].score;
            if(score>tempHighScore){
                tempHighScore = score;
                tempBestBall = activeBalls[i];
            }
        }
        if(tempHighScore>highScore){
            highScore = tempHighScore;
            bestBall = tempBestBall;
        }
    }
    else{
        tempHighScore = bestBall.score;
        if(tempHighScore>highScore){
            highScore = tempHighScore;
        }
    }
        //updating elements now
        highScoreSpan.html(tempHighScore);
        allTimeHighScoreSpan.html(highScore);

        for(let i=0;i<pillars.length;i++){
            pillars[i].show();
        }

        if(runBest){
            bestBall.show();
        }
        else{
            for(let i=0;i<activeBalls.length;i++){
                activeBalls[i].show();
            }
            if(activeBalls.length==0){
                nextGeneration();
            }
        }
    

}
