class Pillar {
    constructor(){
        let empty_space = 125;
        let center = random(empty_space,height-empty_space)

        this.top = center - empty_space/2;
        this.bottom = height - (center + empty_space/2);

        this.x = width;
        this.w = 80;
        this.speed = 6;

    }


    collide(ball) {
        if((ball.y - ball.r) < this.top || (ball.y + ball.r)> (height - this.bottom)){
            if(ball.x > this.x && ball.x < this.x+this.w){
                return true;
            }
        }
        return false;
    }

    showPillar(){
        image(pillarUp, this.x, 0, this.w, this.top);
        image(pillarBottom, this.x, height - this.bottom, this.w, this.bottom);

    }

    update(){
        this.x -= this.speed;
    }

    offscreen(){
        if(this.x < -this.w){
            return true;
        }
        else{
            return false;
        }
    }

}