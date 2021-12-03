const fs = require("fs");
const path = require("path");
const readline = require("readline");

const runForEachLine = (file, fn) =>
  new Promise((resolve) => {
    const reader = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, file), "utf8"),
    });

    reader.on("line", (line) => {
      if (line.trim() !== "") {
        fn(line);
      }
    });

    reader.on("close", resolve);
  });

const mapLines = (file, fn) =>
  new Promise((resolve) => {
    const values = [];
    runForEachLine(file, (line) => {
      values.push(fn(line));
    }).then(() => {
      resolve(values);
    });
  });

const printResults = (part1, part2) => {
  console.log("Result Part 1: ", part1);
  console.log("Result Part 2: ", part2);
};

module.exports = { printResults, runForEachLine, mapLines };
