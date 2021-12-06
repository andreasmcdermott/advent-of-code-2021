const { input, print } = require("utils");

const createPilotForPart1 = () => {
  let horizontal = 0;
  let depth = 0;
  return {
    forward(amt) {
      horizontal += amt;
    },
    down(amt) {
      depth += amt;
    },
    up(amt) {
      depth -= amt;
    },
    get pos() {
      return [horizontal, depth];
    },
    get sum() {
      return horizontal * depth;
    },
  };
};

const createPilotForPart2 = () => {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  return {
    forward(amt) {
      horizontal += amt;
      depth += aim * amt;
    },
    down(amt) {
      aim += amt;
    },
    up(amt) {
      aim -= amt;
    },
    get pos() {
      return [horizontal, depth];
    },
    get sum() {
      return horizontal * depth;
    },
  };
};

const pilot1 = createPilotForPart1();
const pilot2 = createPilotForPart2();

input().forEach((line) => {
  const [action, units] = line.split(" ");
  const amt = parseInt(units, 10);
  if (!action || isNaN(amt)) return;
  pilot1[action](amt);
  pilot2[action](amt);
});

print([pilot1.pos, pilot1.sum], [pilot2.pos, pilot2.sum]);
