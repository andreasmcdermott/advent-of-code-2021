const { input, print } = require("utils");

const LINES = input();

const loop = (x1, y1, x2, y2, fn) => {
  const dx = Math.min(Math.max(x2 - x1, -1), 1);
  const dy = Math.min(Math.max(y2 - y1, -1), 1);

  let x = x1;
  let y = y1;

  while (x !== x2 || y !== y2) {
    fn(x, y);
    x += dx;
    y += dy;
  }

  fn(x, y);
};

function part1and2(rawLines, includeDiagonal) {
  const result = rawLines
    .map((line) => /^(\d+),(\d+) -> (\d+),(\d+)$/.exec(line))
    .map(([, x1, y1, x2, y2]) => [
      parseInt(x1, 10),
      parseInt(y1, 10),
      parseInt(x2, 10),
      parseInt(y2, 10),
    ])
    .filter(([x1, y1, x2, y2]) => includeDiagonal || x1 === x2 || y1 === y2)
    .reduce((acc, points) => {
      loop(...points, (x, y) => {
        acc[`${x},${y}`] = (acc[`${x},${y}`] || 0) + 1;
      });
      return acc;
    }, {});

  return Object.values(result).filter((v) => v >= 2).length;
}

let resultPart1 = part1and2([...LINES], false);
console.log("\n");
let resultPart2 = part1and2([...LINES], true);

print(resultPart1, resultPart2);
