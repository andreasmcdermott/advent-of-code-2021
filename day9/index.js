const { input, print } = require("utils");

const mapLine = (line) => line.split("").map((val) => parseInt(val, 10));

const VALUES = input(mapLine);

const isLowPoint = (map, py, px) => {
  const val = map[py][px];
  const neighbors = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  return neighbors
    .map(([dy, dx]) => [py + dy, px + dx])
    .filter(([y, x]) => y >= 0 && y < map.length && x >= 0 && x < map[y].length)
    .every(([y, x]) => map[y][x] > val);
};

function part1(lines) {
  const lowPoints = [];
  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[y].length; ++x) {
      if (isLowPoint(lines, y, x)) {
        lowPoints.push({ y, x, height: lines[y][x], risk: lines[y][x] + 1 });
      }
    }
  }
  return lowPoints.reduce((acc, { risk }) => acc + risk, 0);
}

function walkBasin(map, y, x) {
  let basinSize = 0;

  if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) return basinSize;
  if (map[y][x] === 9 || map[y][x] === null) return basinSize;

  basinSize += 1;
  map[y][x] = null;

  basinSize += walkBasin(map, y - 1, x);
  basinSize += walkBasin(map, y + 1, x);
  basinSize += walkBasin(map, y, x - 1);
  basinSize += walkBasin(map, y, x + 1);

  return basinSize;
}

function part2(lines) {
  const basins = [];
  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[y].length; ++x) {
      const basin = walkBasin(lines, y, x);
      if (basin) {
        basins.push(basin);
      }
    }
  }

  basins.sort((a, b) => b - a);
  return basins[0] * basins[1] * basins[2];
}

const resultPart1 = part1(VALUES);
const resultPart2 = part2(VALUES);

print(resultPart1, resultPart2);
