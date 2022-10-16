const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const NUM_BALLS = 2;

const MIN_VEL = 5;
const MAX_VEL = 5;

const MIN_SIZE = 100;
const MAX_SIZE = 100;

const MIN_MASS = 10;
const MAX_MASS = 10;

class Vector2D {
    constructor(x, y) {
	this.x = x;
	this.y = y;
    }

    add(vector) {
	return new Vector2D(this.x + vector.x, this.y + vector.y);
    }
    
    sub(vector) {
	return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    distance(vector) {
	const dx = this.x - vector.x;
	const dy = this.y - vector.y;
	return Math.hypot(dx, dy);
    }

    length() {
	return Math.hypot(this.x, this.y);
    }

    scale(num) {
	return new Vector2D(this.x * num, this.y * num);
    }

    normal() {
	return this.scale(1 / this.length());
    }

    dot(vector) {
	return this.x * vector.x + this.y * vector.y;
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
    return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0,255)})`;
}

class Ball {
    constructor(pos, vel, color, radius, mass) {
	this.pos = pos;
	this.vel = vel;
	this.color = color;
	this.radius = radius;
	this.mass = mass;
    }

    draw() {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
	ctx.fill();
    }

    update() {
	if ((this.pos.x + this.radius) >= width) {
	    this.vel.x = -(this.vel.x);
	}

	if ((this.pos.x - this.radius) <= 0) {
	    this.vel.x = -(this.vel.x);
	}

	if ((this.pos.y + this.radius) >= height) {
	    this.vel.y = -(this.vel.y);
	}

	if ((this.pos.y - this.radius) <= 0) {
	    this.vel.y = -(this.vel.y);
	}

	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
    }

    collide(balls) {
	for (const ball of balls) {
	    if (this !== ball && this.collided != true) {
		if (this.pos.distance(ball.pos) < this.radius + ball.radius) {
		    this.collided = true;
		    ball.colluded = true;
		    this.color = randomRGB();
		    this.vel.x = (this.vel.x * (this.mass - ball.mass) + (2 * ball.mass * ball.vel.x)) / (this.mass + ball.mass);
		    this.vel.y = (this.vel.y * (this.mass - ball.mass) + (2 * ball.mass * ball.vel.y)) / (this.mass + ball.mass);
		    ball.vel.x = (ball.vel.x * (ball.mass - this.mass) + (2 * this.mass * this.vel.x)) / (this.mass + ball.mass);
		    ball.vel.y = (ball.vel.y * (ball.mass - this.mass) + (2 * this.mass * this.vel.y)) / (this.mass + ball.mass);
		}
	    }
	}
    }
}

balls = [];

for (let x = 0; x < NUM_BALLS; ++x) {
    const radius = random(MIN_SIZE, MAX_SIZE);

    balls[x] = new Ball(
	new Vector2D(
	    random(0 + radius, width - radius),
	    random(0 + radius, height - radius)),
	new Vector2D(
	    random(MIN_VEL, MAX_VEL),
	    random(MIN_VEL, MAX_VEL)),
	randomRGB(),
	radius,
	random(MIN_MASS, MAX_MASS));
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
	ball.draw();
	ball.update();
    }
    
    for (const ball of balls) {
	ball.collide(balls);
    }

    requestAnimationFrame(loop);
}

// loop();
