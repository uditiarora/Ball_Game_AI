function resetGame(){
    counter = 0;
    if(bestBall){
        bestBall.score = 0;

    }
    pillars = [];

}

function poolSelection(balls){
    let index = 0;
    let r = random(1);
    while(r>0){
        r -= balls[index].fitness;
        index += 1;
    }
    index -= 1;
    return balls[index].copy();
}


function generate(oldBalls){
    let newBalls = [];
    for(let i=0;i<oldBalls.length;i++){
        let ball = poolSelection(oldBalls);
        newBalls[i] = ball;
    }
    return newBalls;
}

function normalizeFitness(balls){
    for(let i=0;ii<balls.length;i++){
        balls[i].score = pow(balls[i].score,2);
    }

    let sum = 0;
    for(let i=0;i<balls.length;i++){
        sum += balls[i].score;
    }
    for(let i=0;i<balls.length;i++){
        balls[i].fitness = balls[i].score/sum;
    }

}

function nextGeneration(){
    resetGame();
    normalizeFitness(allBalls);
    activeBalls = generate(allBalls);
    allBalls = activeBalls.slice();
}



