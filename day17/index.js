const { input, print } = require("utils");

const mapLine = (line) => {
  let [, xfrom, xto, yfrom, yto] =
    /^target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)$/.exec(line);
  xfrom = parseInt(xfrom, 10);
  xto = parseInt(xto, 10);
  yfrom = parseInt(yfrom, 10);
  yto = parseInt(yto, 10);
  return {
    left: xfrom < xto ? xfrom : xto,
    right: xfrom < xto ? xto : xfrom,
    top: yfrom > yto ? yfrom : yto,
    bottom: yfrom < yto ? yfrom : yto,
  };
};

const VALUES = input(mapLine);
const copyLines = (lines) => [...lines.map((line) => line)];

function doSteps(vel, target) {
  const pos = { x: 0, y: 0 };
  const steps = [];
  let hit = false;
  while (true) {
    pos.x += vel.x;
    pos.y += vel.y;
    if (vel.x !== 0) vel.x -= vel.x / Math.abs(vel.x);
    vel.y -= 1;
    steps.push({ ...pos });

    if (
      pos.x >= target.left &&
      pos.x <= target.right &&
      pos.y <= target.top &&
      pos.y >= target.bottom
    ) {
      hit = true;
    }

    if (pos.x > target.right) break;
    if (pos.y < target.bottom) break;
  }

  return {
    steps,
    hit,
  };
}

function part1(target) {
  let maxY = 0;
  const successes = [];
  for (let y = -500; y < 500; ++y) {
    lastClosest = null;
    for (let x = 0; x < 1000; ++x) {
      const { hit, steps } = doSteps({ x: x, y: y }, target);
      if (hit) {
        maxY = steps.reduce((acc, { y }) => (y > acc ? y : acc), maxY);
        successes.push({ x, y });
      }
    }
  }
  return { maxY, successes };
}

function part2(target) {
  return part1(target);
}

const resultPart1 = part1(copyLines(VALUES)[0]).maxY;
const resultPart2 = part2(copyLines(VALUES)[0]).successes.length;

print(resultPart1, resultPart2);
