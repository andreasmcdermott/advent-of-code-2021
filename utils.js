const fs = require("fs");
const path = require("path");

const toArray = (file) => {
  const content = fs.readFileSync(path.resolve(__dirname, file), "utf8");
  return content.split("\n").filter((line) => line.trim() !== "");
};

const printResults = (part1, part2) => {
  console.log("Result Part 1: ", part1);
  console.log("Result Part 2: ", part2);
};

module.exports = { printResults, toArray };
