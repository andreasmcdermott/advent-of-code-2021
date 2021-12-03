const utils = require("./utils");

utils
  .mapLines("./day1-input.txt", (line) => parseInt(line, 10))
  .then((MEASUREMENTS) => {
    // Part 1
    const [part1Result] = MEASUREMENTS.reduce(
      ([count, last], curr) => [
        count + (last !== null && curr > last ? 1 : 0),
        curr,
      ],
      [0, null]
    );

    // Part 2
    let part2Result = 0;
    let last = null;
    for (let i = 2; i < MEASUREMENTS.length; ++i) {
      const curr = MEASUREMENTS[i] + MEASUREMENTS[i - 1] + MEASUREMENTS[i - 2];
      if (last !== null && curr > last) {
        ++part2Result;
      }
      last = curr;
    }

    utils.printResults(part1Result, part2Result);
  });
