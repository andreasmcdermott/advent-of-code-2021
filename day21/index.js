const { input, print } = require("utils");

const mapLine = (line) => line;

const VALUES = input(mapLine);
const copyLines = (lines) => [
  ...lines.map((line) => (Array.isArray(line) ? [...line] : line)),
];

const parseStart = (line) => {
  const [, name, startPos] = /^(Player \d) starting position: (\d)+$/.exec(
    line
  );
  return { name, startPos: parseInt(startPos, 10) };
};

class Player {
  constructor(str) {
    const { name, startPos } = parseStart(str);
    this.name = name;
    this.pos = startPos;
    this.points = 0;
  }
  get score() {
    return this.points;
  }
  move(steps) {
    this.pos += steps;
    while (this.pos > 10) {
      this.pos -= 10;
    }
    this.points += this.pos;
  }
}

class DeterministicDie {
  constructor() {
    this.value = 1;
    this.numRolls = 0;
  }
  roll() {
    const val = this.value++;
    if (this.value > 100) this.value = 1;
    this.numRolls++;
    return val;
  }
  get rolls() {
    return this.numRolls;
  }
}

function part1(lines) {
  const player1 = new Player(lines[0]);
  const player2 = new Player(lines[1]);
  const die = new DeterministicDie();
  let activePlayer = player1;
  while (player1.score < 1000 && player2.score < 1000) {
    activePlayer.move(die.roll() + die.roll() + die.roll());
    activePlayer = activePlayer === player1 ? player2 : player1;
  }

  let loser = player1.score >= 1000 ? player2 : player1;

  return {
    p1: player1.score,
    p2: player2.score,
    rolls: die.rolls,
    answer: die.rolls * loser.score,
  };
}

function part2(lines) {
  return null;
}

const resultPart1 = part1(copyLines(VALUES));
const resultPart2 = part2(copyLines(VALUES));

print(resultPart1, resultPart2);
