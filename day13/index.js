const { input, print } = require("utils");

const mapLine = (line) => line;

const VALUES = input(mapLine);
const copyLines = (lines) => lines;

const readInstructions = (lines) => {
  const dots = [],
    folds = [];
  lines.forEach((line) => {
    if (/^\d+,\d+$/.test(line)) {
      dots.push(line.split(",").map((val) => parseInt(val, 10)));
    } else if (line.startsWith("fold")) {
      const [, axis, value] = /^fold along (x|y)=(\d+)$/.exec(line) || [];
      if (axis && value) {
        folds.push([
          axis === "x" ? parseInt(value, 10) : null,
          axis === "y" ? parseInt(value, 10) : null,
        ]);
      }
    }
  });

  return { dots, folds };
};

const printGrid = (grid) => {
  console.log("");
  for (let y = 0; y < grid.height; ++y) {
    let row = [];
    for (let x = 0; x < grid.width; ++x) {
      if (grid[y][x]) row.push("#");
      else row.push(".");
    }
    console.log(row.join(""));
  }
};

const makeGrid = (dots) => {
  const grid = [];
  const [mx, my] = dots.reduce(
    ([mx, my], [rx, ry]) => [rx > mx ? rx : mx, ry > my ? ry : my],
    [0, 0]
  );

  for (let y = 0; y <= my; ++y) {
    grid.push(new Array(mx + 1).fill(0));
  }

  dots.forEach(([x, y]) => {
    grid[y][x] = 1;
  });

  grid.width = mx + 1;
  grid.height = my + 1;

  return grid;
};

const doFold = (grid, [fx, fy]) => {
  for (let y = fy !== null ? fy + 1 : 0; y < grid.height; ++y) {
    for (let x = fx !== null ? fx + 1 : 0; x < grid.width; ++x) {
      if (grid[y][x]) {
        if (fx !== null) {
          grid[y][fx - (x - fx)] = 1;
        } else if (fy !== null) {
          grid[fy - (y - fy)][x] = 1;
        }
      }
    }
  }

  grid.width = fx || grid.width;
  grid.height = fy || grid.height;

  return grid;
};

const countDots = (grid) =>
  grid.reduce(
    (acc, row, i) =>
      i >= grid.height
        ? acc
        : acc + row.filter((x, i) => i < grid.width && !!x).length,
    0
  );

function part1(lines) {
  const { dots, folds } = readInstructions(lines);

  let grid = makeGrid(dots);
  const fold = folds[0];
  grid = doFold(grid, fold);
  return countDots(grid);
}

function part2(lines) {
  const { dots, folds } = readInstructions(lines);

  let grid = makeGrid(dots);
  folds.forEach((fold) => {
    grid = doFold(grid, fold);
  });
  return grid;
}

const resultPart1 = part1(copyLines(VALUES));
const resultPart2 = part2(copyLines(VALUES));

print(resultPart1, 0);
printGrid(resultPart2);
