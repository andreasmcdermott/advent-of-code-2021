const { input, print } = require("utils");

const mapLine = (line) => line;

const VALUES = input(mapLine);
const copyLines = (lines) => [...lines.map((line) => [...line])];

const readInput = (lines) => {
  const template = lines.shift();
  const pairs = lines
    .map((line) => line.join("").split(" -> "))
    .reduce((acc, [pair, insert]) => {
      acc[pair] = insert;
      return acc;
    }, {});
  return [template, pairs];
};

const updateTemplate = (template, pairs) => {
  let updated = template;

  for (let i = template.length - 2; i >= 0; --i) {
    const pair = `${template[i]}${template[i + 1]}`;
    if (pairs[pair]) {
      updated.splice(i + 1, 0, pairs[pair]);
    }
  }

  return updated;
};

const calcLeastAndMost = (template) =>
  Object.values(
    template.reduce((acc, letter) => {
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {})
  ).reduce(
    ([least, most], val) => [
      least > val ? val : least,
      most < val ? val : most,
    ],
    [Number.MAX_SAFE_INTEGER, 0]
  );

function part1(lines, numSteps) {
  const [startingTemplate, pairs] = readInput(lines);

  let template = startingTemplate;

  for (let i = 0; i < numSteps; ++i) {
    template = updateTemplate(template, pairs);
  }

  const [least, most] = calcLeastAndMost(template);

  return most - least;
}

const createTemplate = (start) => {
  const template = {};
  for (let i = 0; i < start.length - 1; ++i) {
    template[`${start[i]}${start[i + 1]}`] = 1;
  }
  return template;
};

const updateTemplate2 = (template, pairs) => {
  return Object.entries(template).reduce((acc, [key, val]) => {
    const insert = pairs[key];
    if (insert) {
      const newKey1 = `${key[0]}${insert}`;
      const newKey2 = `${insert}${key[1]}`;
      acc[newKey1] = (acc[newKey1] || 0) + val;
      acc[newKey2] = (acc[newKey2] || 0) + val;
    }
    return acc;
  }, {});
};

function part2(lines, numSteps) {
  const [startingTemplate, pairs] = readInput(lines);
  let template = createTemplate(startingTemplate);

  for (let i = 0; i < numSteps; ++i) {
    template = updateTemplate2(template, pairs);
  }

  const [min, max] = Object.values(
    Object.entries(template).reduce((acc, [key, val]) => {
      const [key1, key2] = key.split("");
      acc[key1] = (acc[key1] || 0) + val;
      acc[key2] = (acc[key2] || 0) + val;
      return acc;
    }, {})
  ).reduce(
    ([min, max], val) => [val < min ? val : min, val > max ? val : max],
    [Number.MAX_SAFE_INTEGER, 0]
  );
  return Math.ceil(max / 2 - min / 2);
}

const resultPart1 = part1(copyLines(VALUES), 10);
const resultPart2 = part2(copyLines(VALUES), 40);

print(resultPart1, resultPart2);
