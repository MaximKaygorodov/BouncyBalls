const r = 100;
const screenWidth = 1080;
const screenHeight = 720;
const freefallAcceleration = 1;
const airFriction = 1.0055;
const bounceIndex = -0.75;

const addBall = (x, y, d) => {
  return {
    x,
    y,
    d,
    r: d / 2,
    speed: {
      x: 10,
      y: 2,
    },
  };
};

let ball = addBall(100, 100, r);

const calculateStop = (obj) => {
  const isStopX = Math.abs(obj.speed.x) > 0.5 ? false : true;
  const isStopY = Math.abs(obj.speed.y) > 3 ? false : true;
  return { isStopX, isStopY };
};

const calculateCollideOtherBall = (a, b) => {
  const radiusSum = a.r + b.r;
  if (dist(a.x, a.y, b.x, b.y) < radiusSum) {
    return true;
  }
  return false;
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
  ball = calculateNewSpeed(ball);
  ball = calculateNewXY(ball);
  calculateCollideOtherBall(ball, mouseBall);
  ellipse(mouseX, mouseY, r - 10);
  ellipse(ball.x, ball.y, ball.d);
}
