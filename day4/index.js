const { input, print } = require("utils");

const [NUMBERS, BOARDS] = parseInput(input());

function parseInput([_num, ..._boards]) {
  const numbers = _num.split(",").map((n) => parseInt(n, 10));
  const boards = _boards.reduce(
    (acc, line) => {
      if (acc[acc.length - 1].length === 5) {
        acc.push([]);
      }
      const curr = acc[acc.length - 1];

      curr.push(
        line
          .split(/\s+/g)
          .filter((str) => /^\d+$/.test(str))
          .map((n) => parseInt(n, 10))
      );

      return acc;
    },
    [[]]
  );
  return [numbers, boards];
}

function createBoards(_boards) {
  const boards = new Set(_boards.map(createBoard));

  return {
    get size() {
      return boards.size;
    },
    onBingo(fn) {
      boards.forEach((board) => {
        board.onBingo(() => {
          console.log("bingo internal", board);
          fn(board);
        });
      });
    },
    remove(board) {
      boards.delete(board);
    },
    mark(n) {
      boards.forEach((board) => board.mark(n));
    },
  };
}

function createBoard(board) {
  const cells = board.reduce(
    (acc, row, y) => {
      const rowCells = row.map((n, x) => ({ y, x, number: n, marked: false }));
      acc.all.push(...rowCells);
      rowCells.forEach((cell) => {
        acc[cell.number] = cell;
        acc[`${cell.y},${cell.x}`] = cell;
      });
      return acc;
    },
    { all: [] }
  );
  let last = null;
  const subscribers = [];
  const update = (n) => {
    last = n;
    if (cells[n]) {
      cells[n].marked = true;
      if (isBingo(cells[n])) {
        bingo();
      }
    }
  };
  const isBingo = (cell) => {
    const arr = [0, 1, 2, 3, 4];
    return (
      arr.every((x) => cells[`${cell.y},${x}`].marked) ||
      arr.every((y) => cells[`${y},${cell.x}`].marked)
    );
  };
  const bingo = () => {
    subscribers.forEach((fn) => fn());
  };

  return {
    get answer() {
      return (
        cells.all
          .filter((cell) => !cell.marked)
          .reduce((acc, cell) => acc + cell.number, 0) * last
      );
    },
    mark(num) {
      update(num);
    },
    onBingo(fn) {
      subscribers.push(fn);
      return () => {
        const ix = subscribers.indexOf(fn);
        subscribers.splice(ix, 1);
      };
    },
  };
}

// PART 1

function playPart1(boards, numbers) {
  let winner = null;

  boards.onBingo((board) => {
    winner = board;
  });

  while (!winner && numbers.length > 0) {
    const n = numbers.shift();
    console.log(n);
    boards.mark(n);
  }

  return winner;
}

// PART 2

function playPart2(boards, numbers) {
  let lastWinner = null;

  boards.onBingo((board) => {
    lastWinner = board;
    boards.remove(board);
  });

  while (boards.size > 0 && numbers.length > 0) {
    const n = numbers.shift();
    boards.mark(n);
  }

  return lastWinner;
}

let resultPart1 = playPart1(createBoards(BOARDS), [...NUMBERS]).answer;
let resultPart2 = playPart2(createBoards(BOARDS), [...NUMBERS]).answer;

print(resultPart1, resultPart2);
