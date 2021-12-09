const { input, print } = require("utils");

const mapLine = (line) => {
  const [input, output] = line.split("|");
  return [
    input
      .split(/\s+/g)
      .map((s) => s.trim())
      .filter(Boolean),
    output
      .split(/\s+/g)
      .map((s) => s.trim())
      .filter(Boolean),
  ];
};

const VALUES = input(mapLine);

function part1(lines) {
  return lines
    .reduce((acc, [, output]) => acc.concat(output), [])
    .filter((val) => [2, 4, 3, 7].includes(val.length)).length;
}

/**

0: 6   [1: 2]   2: 5    3: 5   [4: 4]
5: 5    6: 6   [7: 3]  [8: 7]   9: 6 

  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

*/

const numbers = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
};

const mapA = (num1, num7) => {
  return num7.split("").find((char) => !num1.includes(char));
};
const mapB = (num1, num4, len5) => {
  const bAndD = num4.split("").filter((char) => !num1.includes(char));
  const numThree = len5.find((val) =>
    num1.split("").every((char) => val.includes(char))
  );
  return bAndD.find((char) => !numThree.includes(char));
};
const mapC = (num1, len6) => {
  const cAndF = num1.split("");
  const numSix = len6.find((val) => cAndF.some((char) => !val.includes(char)));
  return cAndF.find((char) => !numSix.includes(char));
};
const mapD = (map, num4) => {
  const known = [map.b, map.c, map.f];
  return num4.split("").find((char) => !known.includes(char));
};
const mapE = (map, len6) => {
  const num9 = len6.find((val) => val.includes(map.c) && val.includes(map.d));
  return "abcdefg".split("").find((char) => !num9.includes(char));
};
const mapF = (map, num7) => {
  const known = [map.a, map.c];
  return num7.split("").find((char) => !known.includes(char));
};
const mapG = (map, num8) => {
  return num8.split("").find((char) => !Object.values(map).includes(char));
};

function createMap(input) {
  const map = {};
  const valuesByLength = [...new Set(input)].reduce((acc, val) => {
    acc[val.length] = (acc[val.length] || []).concat([val]);
    return acc;
  }, {});

  map.a = mapA(valuesByLength[2][0], valuesByLength[3][0]);
  map.b = mapB(valuesByLength[2][0], valuesByLength[4][0], valuesByLength[5]);
  map.c = mapC(valuesByLength[2][0], valuesByLength[6]);
  map.f = mapF(map, valuesByLength[3][0]);
  map.d = mapD(map, valuesByLength[4][0]);
  map.e = mapE(map, valuesByLength[6]);
  map.g = mapG(map, valuesByLength[7][0]);

  return Object.entries(map).reduce((acc, [real, scrambled]) => {
    acc[scrambled] = real;
    return acc;
  }, {});
}

function translate(output, map) {
  const numAsString = output
    .map((val) =>
      val
        .split("")
        .map((char) => map[char])
        .sort()
        .join("")
    )
    .map((val) => numbers[val])
    .join("");
  return parseInt(numAsString, 10);
}

function part2(lines) {
  return lines
    .map(([input, output]) => [output, createMap(input, output)])
    .map(([output, map]) => translate(output, map))
    .reduce((acc, num) => acc + num, 0);
}

const resultPart1 = part1(VALUES);
const resultPart2 = part2(VALUES);

print(resultPart1, resultPart2);
