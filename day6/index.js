const { input, print } = require("utils");

const LINES = input();

const getFish = (lines) =>
  lines.reduce(
    (acc, line) => acc.concat(line.split(",").map((v) => parseInt(v, 10))),
    []
  );

function part1(initialFish, days) {
  let fish = initialFish;

  while (days-- > 0) {
    const newFish = [];
    fish.forEach((f) => {
      if (f === 0) {
        newFish.push(6, 8);
      } else {
        newFish.push(f - 1);
      }
    });
    fish = newFish;
  }

  return fish.length;
}

function part2(initialFish, days) {
  const counts = initialFish.reduce((acc, f) => {
    acc[f] = (acc[f] || 0) + 1;
    return acc;
  }, []);

  while (days-- > 0) {
    const zeros = counts[0] || 0;
    for (let i = 1; i <= 8; ++i) {
      counts[i - 1] = counts[i] || 0;
    }
    counts[6] += zeros;
    counts[8] = zeros;
  }
  return Object.values(counts).reduce((acc, c) => acc + c, 0);
}

let resultPart1 = part1(getFish(LINES), 80);
let resultPart2 = part2(getFish(LINES), 256);

print(resultPart1, resultPart2);
