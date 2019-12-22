function mutate(x){
    if(random(1)<0.1){
        let offset = randomeGaussian() *0.5;
        return x + offset;
    }
    else{
        return x;
    }
}


class Ball{
    constructor(brain){
        this.x = 64;
        this.y = height/2;
        this.r = 12;
        this.gravity = 0.8;
        this.lift = -12;
        this.velocity = 0;

        if(brain instanceof NeuralNetwork){
            this.brain = brain.copy();
            this.brain.mutate(mutate);
        }
        else{
            this.brain = new NeuralNetwork(5,8,2);
        }

        this.score = 0;
        this.fitness = 0;
    }

    copy(){
        return new Ball(this.brain);
    }
    showPillar(){
        image(ballImg,this.x, this.y, this.r*2, this.r*2);
    }

    up(){
        this.velocity += this.lift;
    }

    update(){
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.score++;
    }

    bottomTop(){
        return (this.y>height || this.y<0);
    }
    think(pillars){
        let close = null;
        let rec = Infinity;
        for(let i=0;i<pillars.length;i++){
            let dif = pillars[i].x - this.x;
            if(dif>0 && dif< rec){
                rec  = dif;
                close = pillars[i];
            }
        }
        if(close != null){
            let input = [];
            input[0] = map(close.x, this.x, width, 0, 1);   
            input[1] = map(close.top,0,height,0,1);
            input[2] = map(close.bottom, 0, height, 0, 1);
            input[3] = map(this.y,0,height,0,1);
            input[4] = map(this.velocity,-5,5,0,1);
            let action = this.brain.predict(inputs);
            if(action[1]>action[0]){
                this.up();
            }
        }
    }


}