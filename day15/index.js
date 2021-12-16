const { input, print } = require("utils");

const mapLine = (row, y) =>
  row.split("").map((risk, x) => ({ x, y, risk: parseInt(risk, 10) }));
const copyData = (lines) => [...lines.map((line) => ({ ...line }))];

const data = input(mapLine).reduce((acc, row) => acc.concat(row), []);

const expandGrid = (grid, times) => {
  const width = grid.reduce((acc, t) => (t.x > acc ? t.x : acc), 0) + 1;
  const height = grid.reduce((acc, t) => (t.y > acc ? t.y : acc), 0) + 1;

  const largeGrid = [...grid];
  for (const tile of grid) {
    for (let y = 0; y < times; ++y) {
      for (let x = 0; x < times; ++x) {
        if (y === 0 && x === 0) continue;
        let risk = tile.risk + 1 * y + 1 * x;
        if (risk > 9) risk -= 9;
        largeGrid.push({
          ...tile,
          x: tile.x + width * x,
          y: tile.y + height * y,
          risk: risk,
        });
      }
    }
  }

  return largeGrid;
};

const neighbors = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

const addNeighbors = (data) => {
  const getKey = (x, y) => `${x},${y}`;
  const tiles = data.reduce((acc, t) => {
    acc[getKey(t.x, t.y)] = t;
    return acc;
  }, {});
  for (const tile of data) {
    tile.neighbors = neighbors
      .map((n) => tiles[getKey(n.x + tile.x, n.y + tile.y)])
      .filter(Boolean);
  }
};

const findBestPath = (grid, queue) => {
  while (queue.length) {
    const { risk, node } = queue.shift();

    for (const neighbor of node.neighbors.filter(
      (n) => n.minRisk === undefined
    )) {
      neighbor.minRisk = risk + neighbor.risk;
      queue.push({ risk: risk + neighbor.risk, node: neighbor });
    }

    queue.sort((a, b) => a.risk - b.risk);
  }

  return grid[grid.length - 1];
};

function part1(grid) {
  addNeighbors(grid);
  const start = grid[0];
  start.minRisk = 0;
  return findBestPath(grid, [{ risk: 0, node: start }]).minRisk;
}

function part2(grid) {
  grid = expandGrid(grid, 5);
  addNeighbors(grid);
  const start = grid[0];
  start.minRisk = 0;
  return findBestPath(grid, [{ risk: 0, node: start }]).minRisk;
}

const resultPart1 = part1(copyData(data));
const resultPart2 = part2(copyData(data));

print(resultPart1, resultPart2);
