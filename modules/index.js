const r = 100;
const screenWidth = 1080;
const screenHeight = 720;
const freefallAcceleration = 0.5;
const airFriction = 1.0025;
const bounceIndex = -0.75;

const addBall = (x, y, r) => {
  return {
    x,
    y,
    r,
    speed: {
      x: 100,
      y: 2,
    },
  };
};

let ball = addBall(100, 100, r);

const calculateStop = (obj) => {
  const isStopX = Math.abs(obj.speed.x) > 0.5 ? false : true;
  const isStopY =
    Math.abs(obj.speed.y) > freefallAcceleration * 2 + 1 ? false : true;
  return { isStopX, isStopY };
};

const calculateCollideBordersX = (obj) => {
  const radius = obj.r / 2;
  const x = obj.x;
  const speed = obj.speed.x;

  if (x > screenWidth - radius - speed) return screenWidth - radius;
  if (x < radius - speed) return radius;
  return false;
};

const calculateCollideBordersY = (obj) => {
  const radius = obj.r / 2;
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
        (obj.speed.y + freefallAcceleration) *
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
  createCanvas(screenWidth, screenHeight);
}

function draw() {
  background(100);
  ball = calculateNewSpeed(ball);
  ball = calculateNewXY(ball);
  ellipse(ball.x, ball.y, ball.r);
}
