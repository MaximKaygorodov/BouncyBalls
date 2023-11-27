const r = 100;
const screenWidth = 800;
const screenHeight = 600;
const freefallAcceleration = 1;
const airFriction = 1.02;
const bounceIndex = -0.5;

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

// const bounceBotom = (obj) => {
//   return {
//     ...obj,
//     speed: {
//       ...speed,
//       y: obj.speed.y * -0.5,
//     },
//   };
// };

// const bounceSide = (obj) => {
//   return {
//     ...obj,
//     speed: {
//       ...speed,
//       x: obj.speed.y * -0.5,
//     },
//   };
// };
// const move = (obj) => {
//   const { x, speed } = obj;
//   // console.log(x, speed.x, x + speed.x);
//   const speedX = Math.abs(speed.x) > 1 ? speed.x - airFriction : 0;
//   return {
//     ...obj,
//     x: x + speed.x,
//     speed: {
//       ...speed,
//       x: speedX,
//     },
//   };
// };

// const calculateFreefall = (obj) => {
//   const freefallY = obj.y + obj.speed.y;
//   return freefallY;
// };

const calculateStop = (obj) => {
  const isStopX = Math.abs(obj.speed.x) > 1 ? false : true;
  const isStopY =
    Math.abs(obj.speed.y) > freefallAcceleration * 2 + 1 ? false : true;

  console.log("speed when calculating stop: ", obj.speed.y);
  return { isStopX, isStopY };
};

const calculateCollide = (obj) => {
  const overlapX = obj.x + obj.r / 2 - screenWidth;
  const isCollideX = overlapX > 0 ? true : false;

  const overlapY = obj.y + obj.r / 2 - screenHeight;
  const isCollideY = overlapY > 0 ? true : false;
  return { isCollideX, isCollideY, overlapY, overlapX };
};

const calculateNewSpeed = (obj) => {
  const { isStopX, isStopY } = calculateStop(obj);
  const { isCollideX, isCollideY } = calculateCollide(obj);
  console.log(isCollideY);
  // maybe i should calculade collide after new speed?
  return {
    ...obj,
    speed: {
      x:
        (obj.speed.x / airFriction) *
        (isCollideX ? bounceIndex : 1) *
        (isStopX ? 0 : 1),
      y:
        (obj.speed.y + freefallAcceleration) *
        (isCollideY ? bounceIndex : 1) *
        (isCollideY && isStopY ? 0 : 1),
    },
  };
};

const calculateNewXY = (obj) => {
  const { overlapX, overlapY, isCollideX, isCollideY } = calculateCollide(obj);

  let x = obj.speed.x + obj.x - (isCollideX ? overlapX : 0);
  let y = obj.speed.y + obj.y - (isCollideY ? overlapY : 0);

  return { ...obj, x, y };
};

// const fall = (obj) => {
//   // console.log("hi");
//   const { y, speed, r } = obj;
//   console.log(y, speed, obj);
//   const freefallY = y + speed.y;
//   const overshotY = freefallY + r / 2 - screenHeight;
//   const isOvershotY = overshotY > 0 ? true : false;

//   let actualY = freefallY;
//   let speedY = speed.y + freefallAcceleration;

//   if (isOvershotY) {
//     actualY = freefallY - overshotY;
//     speedY = Math.abs(speedY) < freefallAcceleration * 2 + 1 ? 0 : speedY;
//   }

//   return {
//     ...obj,
//     y: actualY,
//     speed: {
//       ...speed,
//       y: speedY,
//     },
//   };
// };

function setup() {
  createCanvas(screenWidth, screenHeight);
}

function draw() {
  background(100);
  ball = calculateNewSpeed(ball);
  ball = calculateNewXY(ball);
  // console.log(fall(ball));
  ellipse(ball.x, ball.y, ball.r);
}
