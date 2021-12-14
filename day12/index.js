const { input, print } = require("utils");

const mapLine = (line) => line.split("-");
const copyLines = (lines) => [...lines.map((line) => [...line])];

const VALUES = input(mapLine);

const newNode = (name) => ({
  name,
  connections: new Set(),
  big: name.toUpperCase() === name,
  start: name === "start",
  end: name === "end",
});

const buildMap = (lines) => {
  const nodesByName = {};
  lines.forEach(([fromName, toName]) => {
    if (!nodesByName[fromName]) nodesByName[fromName] = newNode(fromName);
    if (!nodesByName[toName]) nodesByName[toName] = newNode(toName);

    const from = nodesByName[fromName];
    const to = nodesByName[toName];
    from.connections.add(to);
    to.connections.add(from);
  });

  return nodesByName;
};

const finalPath = (paths) => paths.map((node) => node.name).join(",");

const canVisitSmallCave = (path, cave, canVisitSmallCaveTwice) => {
  if (!path.includes(cave)) return true;
  if (!canVisitSmallCaveTwice) return false;

  const smallCaves = path.filter(
    (node) => !node.big && !node.start && !node.end
  );
  return new Set(smallCaves).size === smallCaves.length;
};

const findAllPaths = (nodes, canVisitSmallCaveTwice) => {
  if (!nodes.start || !nodes.end) throw new Error("no start and/or end");
  const paths = [{ path: [nodes.start] }];
  const completedPaths = new Set();

  while (paths.length) {
    const { path } = paths.shift();
    const lastNode = path[path.length - 1];
    lastNode.connections.forEach((node) => {
      if (node.start) return;
      if (node.end) {
        completedPaths.add(finalPath([...path, node]));
      } else if (
        node.big ||
        canVisitSmallCave(path, node, canVisitSmallCaveTwice)
      ) {
        paths.push({ path: [...path, node] });
      }
    });
  }

  return completedPaths;
};

function part1(lines) {
  const nodes = buildMap(lines);
  const paths = findAllPaths(nodes, false);
  return paths.size;
}

function part2(lines) {
  const nodes = buildMap(lines);
  const paths = findAllPaths(nodes, true);
  return paths.size;
}

const resultPart1 = part1(copyLines(VALUES));
const resultPart2 = part2(copyLines(VALUES)); // This is pretty slow.. but not so slow that I tried to figure out a more optimized solution...

print(resultPart1, resultPart2);
