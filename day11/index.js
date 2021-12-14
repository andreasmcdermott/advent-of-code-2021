const { input, print } = require("utils");

const mapLine = (line) => line.split("").map((v) => parseInt(v, 10));

const VALUES = input(mapLine);

const forEach = (lines, fn) => {
  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[y].length; ++x) {
      fn(y, x, lines[y][x]);
    }
  }
};

const step = (octos) => {
  const flashers = new Set();
  const willFlash = [];

  const flash = (y, x) => {
    willFlash.push([y, x]);
    flashers.add(`${y},${x}`);
    octos[y][x] = 0;
  };

  forEach(octos, (y, x) => {
    if (++octos[y][x] > 9) {
      flash(y, x);
    }
  });

  while (willFlash.length) {
    const [oy, ox] = willFlash.shift();
    for (
      let y = Math.max(0, oy - 1);
      y <= Math.min(octos.length - 1, oy + 1);
      ++y
    ) {
      for (
        let x = Math.max(0, ox - 1);
        x <= Math.min(octos[y].length - 1, ox + 1);
        ++x
      ) {
        if (!flashers.has(`${y},${x}`)) {
          if (++octos[y][x] > 9) {
            flash(y, x);
          }
        }
      }
    }
  }

  return flashers.size;
};

function part1(lines, numSteps) {
  let numFlashes = 0;
  for (let i = 0; i < numSteps; ++i) {
    numFlashes += step(lines);
  }
  return numFlashes;
}

function part2(lines) {
  let steps = 0;

  while (true) {
    steps++;
    const numFlashes = step(lines);
    if (numFlashes === 100) break;
  }
  return steps;
}

const resultPart1 = part1([...VALUES.map((line) => [...line])], 100);
const resultPart2 = part2([...VALUES.map((line) => [...line])]);

print(resultPart1, resultPart2);
