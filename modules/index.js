const r = 50;
const screenWidth = 1080;
const screenHeight = 720;
const freefallAcceleration = 0.9;
const airFriction = 1.0055;
const bounceIndex = -0.7;
const ballBounce = -1;
let score = 0;

const addBall = (x, y, d) => {
  return {
    x,
    y,
    d,
    r: d / 2,
    speed: {
      x: 1,
      y: 5,
    },
  };
};
let balls = [];

for (let i = 1; i < 20; i++) {
  balls.push(addBall(i * Math.random() * 100, Math.random() * i * 10, r));
}

let rightBasket = addBall(screenWidth - 10, 200, 15);
let leftBasket = addBall(screenWidth - 10 - 1.5 * r, 200, 15);

const calculateStop = (ball) => {
  const isStopX = Math.abs(ball.speed.x) > 0.1 ? false : true;
  const isStopY = Math.abs(ball.speed.y) > 3 ? false : true;
  return { isStopX, isStopY };
};

const calculateScore = (ball) => {
  if (ball.x < rightBasket.x && ball.x > leftBasket.x) {
    if (ball.y < rightBasket.y && ball.y + ball.speed.y >= rightBasket.y) {
      score += 1;
    }
  }
};

const calculateCollideMouse = (a, b) => {
  const radiusSum = a.r + b.r;

  if (dist(a.x, a.y, b.x, b.y) < radiusSum) {
    const angle = atan2(a.x - b.x, a.y - b.y);
    return {
      ...a,
      speed: {
        x: a.speed.x + (radiusSum - dist(a.x, a.y, b.x, b.y)) * sin(angle),
        y: a.speed.y + (radiusSum - dist(a.x, a.y, b.x, b.y)) * cos(angle),
      },
    };
  }
  return a;
};

const calculateCollideBasket = (a, b) => {
  const radiusSum = a.r + b.r;

  if (dist(a.x, a.y, b.x, b.y) < radiusSum) {
    const angle = atan2(a.x - b.x, a.y - b.y);
    return {
      ...a,
      speed: {
        x: a.speed.x + (radiusSum - dist(a.x, a.y, b.x, b.y)) * sin(angle),
        y: a.speed.y + (radiusSum - dist(a.x, a.y, b.x, b.y)) * cos(angle),
      },
    };
  }

  return a;
};

const calculateCollideBordersX = (ball) => {
  const radius = ball.r;
  const x = ball.x;
  const speed = ball.speed.x;

  if (x > screenWidth - radius - speed) return screenWidth - radius;
  if (x < radius - speed) return radius;
  return false;
};

const calculateCollideBordersY = (ball) => {
  const radius = ball.r;
  const y = ball.y;
  const speed = ball.speed.y;

  if (y > screenHeight - radius - speed) return screenHeight - radius;
  if (y < radius - speed) return radius;
  return false;
};

const calculateNewSpeed = (ball) => {
  const { isStopX, isStopY } = calculateStop(ball);
  const offsetY = calculateCollideBordersY(ball);

  return {
    ...ball,
    speed: {
      x:
        (ball.speed.x / airFriction) *
        (calculateCollideBordersX(ball) ? bounceIndex : 1) *
        (isStopX ? 0 : 1),
      y:
        ((ball.speed.y + freefallAcceleration) / airFriction) *
        (offsetY ? bounceIndex : 1) *
        (offsetY && isStopY ? 0 : 1),
    },
  };
};

const calculateNewXY = (ball) => {
  let x = calculateCollideBordersX(ball) || ball.speed.x + ball.x;
  let y = calculateCollideBordersY(ball) || ball.speed.y + ball.y;

  return { ...ball, x, y };
};

function setup() {
  frameRate(60);
  createCanvas(screenWidth, screenHeight);
}

function draw() {
  let mouseBall = addBall(mouseX, mouseY, r + 40);

  noStroke();
  textSize(32);

  background(238, 232, 170);
  fill(color(255, 99, 71));
  text(`Score: ${score}`, 20, 50);

  for (let j = 0; j < balls.length; j++) {
    balls[j] = calculateNewSpeed(balls[j]);
    balls[j] = calculateNewXY(balls[j]);
    balls[j] = calculateCollideMouse(balls[j], mouseBall);
    balls[j] = calculateCollideBasket(balls[j], rightBasket);
    balls[j] = calculateCollideBasket(balls[j], leftBasket);
    calculateScore(balls[j]);
    ellipse(balls[j].x, balls[j].y, balls[j].d);
  }
  fill(color(72, 61, 139));
  ellipse(mouseBall.x, mouseBall.y, mouseBall.d);
  ellipse(leftBasket.x, leftBasket.y, leftBasket.d);
  ellipse(rightBasket.x, rightBasket.y, rightBasket.d);
}
