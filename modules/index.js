const r = 50;
const screenWidth = 1080;
const screenHeight = 720;
const freefallAcceleration = 1;
const airFriction = 1.0055;
const bounceIndex = -0.75;
const ballBounce = -1;

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
  balls.push(addBall(50 * i, 10, r - 20));
}

const calculateStop = (obj) => {
  // const isStopX = false;
  // const isStopY = false;
  const isStopX = Math.abs(obj.speed.x) > 0.5 ? false : true;
  const isStopY = Math.abs(obj.speed.y) > 3 ? false : true;
  return { isStopX, isStopY };
};

const calculateCollideOtherBall = (a, b) => {
  const radiusSum = a.r + b.r;
  const angle = atan2(a.x - b.x, a.y - b.y);

  if (dist(a.x, a.y, b.x, b.y) < radiusSum) {
    const ret = {
      ...a,
      speed: {
        x: a.speed.x + (radiusSum - dist(a.x, a.y, b.x, b.y)) * sin(angle),
        y: a.speed.y + (radiusSum - dist(a.x, a.y, b.x, b.y)) * cos(angle),
      },
    };
    return ret;
  }

  return a;
};

const calculateCollideBordersX = (obj) => {
  const radius = obj.r;
  const x = obj.x;
  const speed = obj.speed.x;

  if (x > screenWidth - radius - speed) return screenWidth - radius;
  if (x < radius - speed) return radius;
  return false;
};

const calculateCollideBordersY = (obj) => {
  const radius = obj.r;
  const y = obj.y;
  const speed = obj.speed.y;

  if (y > screenHeight - radius - speed) return screenHeight - radius;
  if (y < radius - speed) return radius;
  return false;
};

const calculateNewSpeed = (obj) => {
  const { isStopX, isStopY } = calculateStop(obj);
  const offsetY = calculateCollideBordersY(obj);

  return {
    ...obj,
    speed: {
      x:
        (obj.speed.x / airFriction) *
        (calculateCollideBordersX(obj) ? bounceIndex : 1) *
        (isStopX ? 0 : 1),
      y:
        ((obj.speed.y + freefallAcceleration) / airFriction) *
        (offsetY ? bounceIndex : 1) *
        (offsetY && isStopY ? 0 : 1),
    },
  };
};

const calculateNewXY = (obj) => {
  let x = calculateCollideBordersX(obj) || obj.speed.x + obj.x;
  let y = calculateCollideBordersY(obj) || obj.speed.y + obj.y;

  return { ...obj, x, y };
};

function setup() {
  frameRate(60);
  createCanvas(screenWidth, screenHeight);
}

function draw() {
  let mouseBall = addBall(mouseX, mouseY, r - 10);
  background(100);

  for (let j = 0; j < balls.length; j++) {
    balls[j] = calculateNewSpeed(balls[j]);
    balls[j] = calculateNewXY(balls[j]);
    balls[j] = calculateCollideOtherBall(balls[j], mouseBall);
    ellipse(balls[j].x, balls[j].y, balls[j].d);
  }
  ellipse(mouseX, mouseY, r - 10);
}
