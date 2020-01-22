let canvas;
let context;
let canvasWidth = 1400;
let ship;
let canvasHeight = 1000;
let keys = [];
let bullets = [];
let asteroids = [];

document.addEventListener('DOMContentLoaded', setupCanvas);

function getRadians(angle) {
    return angle / Math.PI * 180;
}

function setupCanvas() {
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.fillStyle = 'black';
    context.fillRect(0,0,canvas.width, canvas.height);
    ship = new Ship(); 
    for(let i = 0; i < 8; i++) {
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });

    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
        if(e.keyCode === 32) {
            bullets.push(new Bullet(ship.angle));
        }
    });

    Render();
}

class Asteroid {
    constructor(x,y) {
        this.visible = true;
        this.x = Math.floor(Math.random() * canvasWidth);
        this.y = Math.floor(Math.random() * canvasHeight);
        this.speed = 1;
        this.radius = 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
    }

    Update() {
        let radians = getRadians(this.angle);
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;

        if(this.x < this.radius) {
            this.x = canvas.width
        }
        if(this.x > canvas.width) {
            this.x = this.radius
        }
        if(this.y < this.radius) {
            this.y = canvas.height;
        }
        if(this.y > canvas.height){
            this.y = this.radius;
        }
    }
    Draw() {
        context.beginPath();
        let vertAngle = (( Math.PI * 2 ) / 6);
        let radians = getRadians(this.angle);

        for(let i = 0; i < 6; i++) {
            context.lineTo(
                this.x - this.radius * Math.cos(vertAngle * i + radians), 
                this.y - this.radius * Math.sin(vertAngle * i + radians)
            );
        }
        context.closePath()
        context.stroke();
    }
}
class Bullet {
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
    }

    Update() {
        let radians = getRadians(this.angle);
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;

    }

    Draw() {
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed =  0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight/ 2;

    }

    Rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }

    Update() {
        let radians = this.angle / Math.PI * 180
  
        if(this.movingForward){
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        if(this.x < this.radius) {
            this.x = canvas.width
        }
        if(this.x > canvas.width) {
            this.x = this.radius
        }
        if(this.y < this.radius) {
            this.y = canvas.height;
        }
        if(this.y > canvas.height){
            this.y = this.radius;
        }
        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x -= this.velX;
        this.y -= this.velY;

    }

    Draw() {
        context.strokeStyle = this.strokeColor;
        context.beginPath();
        let vertAngle = ((Math.PI * 2) /3);
        let radians =  this.angle / Math.PI * 180;
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);

        for( let i = 0; i < 3; i++) {
            context.lineTo(
                this.x - this.radius * Math.cos(vertAngle * i + radians), 
                this.y - this.radius * Math.sin(vertAngle * i + radians)
            );
        }
        context.closePath()
        context.stroke();
    }
}
function Render() {
    ship.movingForward = (keys[87]);
    if(keys[68]) {
        ship.Rotate(1);
    }
    if(keys[65]) {
        ship.Rotate(-1);
    }
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    ship.Update();
    ship.Draw();
    if(bullets.length) {
        bullets.forEach(bullet =>  {
            bullet.Update();
            bullet.Draw();
        });
    }
    if(asteroids.length !==0 ) {
            asteroids.forEach( asteroid =>  {
                asteroid.Update();
                asteroid.Draw();
            });
    }
    requestAnimationFrame(Render);
}