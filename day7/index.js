const { input, print } = require("utils");

const mapLine = (line) => line.split(",").map((v) => parseInt(v, 10));

const VALUES = input(mapLine)[0];

const getMinMax = (lines) =>
  lines.reduce(
    ([min, max], v) => [v < min ? v : min, v > max ? v : max],
    [lines[0], lines[0]]
  );

function part1And2(lines, calcCost) {
  const [min, max] = getMinMax(lines);

  const result = [];
  for (let i = min; i <= max; ++i) {
    const cost = lines.reduce((acc, v) => acc + calcCost(i, v), 0);
    if (result[0] && result[0][1] > cost) {
      result.unshift([i, cost]);
    } else {
      result.push([i, cost]);
    }
  }

  return result[0];
}

let resultPart1 = part1And2(VALUES, (target, current) =>
  Math.abs(current - target)
);

const f = (v) => {
  let sum = 0;
  let i = 0;
  while (i < v) {
    sum += ++i;
  }
  return sum;
};
let resultPart2 = part1And2(VALUES, (target, current) =>
  f(Math.abs(current - target))
);

print(resultPart1, resultPart2);
