const { input, print } = require("utils");

const mapLine = (line) => line.split("");

const VALUES = input(mapLine);

const OPEN = ["(", "{", "<", "["];
const CLOSE = [")", "}", ">", "]"];

const isCorrupted = (open, close) =>
  CLOSE.indexOf(close) !== OPEN.indexOf(open);

const parseLine = (line) => {
  const stack = [];
  const chunks = [...line];
  while (chunks.length) {
    const char = chunks.shift();
    if (~OPEN.indexOf(char)) {
      stack.push(char);
    } else if (~CLOSE.indexOf(char)) {
      const open = stack.pop();
      if (isCorrupted(open, char)) return { corrupted: true, char };
    } else {
      console.log("This shouldn't happen.....");
    }
  }

  if (stack.length) {
    return {
      incomplete: true,
      missingChars: stack.reverse().map((char) => CLOSE[OPEN.indexOf(char)]),
    };
  }

  return { valid: true };
};

function part1(lines) {
  const POINTS = { ")": 3, "]": 57, "}": 1197, ">": 25137 };

  return lines.reduce((acc, line) => {
    const result = parseLine(line);
    if (result.corrupted) return acc + POINTS[result.char];
    return acc;
  }, 0);
}

function part2(lines) {
  const POINTS = { ")": 1, "]": 2, "}": 3, ">": 4 };
  const calculatePoints = (chars) =>
    chars.reduce((acc, char) => acc * 5 + POINTS[char], 0);
  const takeMiddle = (points) =>
    points.sort((a, b) => a - b)[Math.floor(points.length / 2)];

  return takeMiddle(
    lines.reduce((acc, line) => {
      const result = parseLine(line);
      if (result.incomplete) {
        return [...acc, calculatePoints(result.missingChars)];
      }
      return acc;
    }, [])
  );
}

const resultPart1 = part1(VALUES);
const resultPart2 = part2(VALUES);

print(resultPart1, resultPart2);
