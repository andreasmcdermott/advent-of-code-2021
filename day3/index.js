const { input, print } = require("utils");

const LINES = input();

// Part 1:
const [gammaRate, epsilonRate] = LINES.reduce((acc, line) => {
  line.split("").forEach((char, i) => {
    acc[i] = (acc[i] || 0) + (parseInt(char, 10) * 2 - 1);
  });
  return acc;
}, [])
  .reduce(
    (acc, count) => {
      acc[0] += count < 0 ? 0 : 1;
      acc[1] += count < 0 ? 1 : 0;
      return acc;
    },
    ["", ""]
  )
  .map((v) => parseInt(v, 2));

// Part 2:
const filterLines = (filterFn) => {
  let validValues = [...LINES];
  let i = 0;
  while (validValues.length > 1) {
    const count = validValues.reduce(
      (acc, v) => acc + (parseInt(v[i], 10) * 2 - 1),
      0
    );
    validValues = validValues.filter((v) => filterFn(v[i], count));
    ++i;
  }
  return parseInt(validValues[0], 2);
};

const oxygen = filterLines((v, count) => v === (count < 0 ? "0" : "1"));
const co2 = filterLines((v, count) => v === (count < 0 ? "1" : "0"));

print(gammaRate * epsilonRate, oxygen * co2);
