const { input, print } = require("utils");

const mapLine = (line) => line;

const VALUES = input(mapLine);
const copyLines = (lines) => [
  ...lines.map((line) => (Array.isArray(line) ? [...line] : line)),
];

class Image {
  constructor(img) {
    this.data = img;
    this.infinite = ".";
  }

  get w() {
    return this.data[0].length;
  }
  get h() {
    return this.data.length;
  }
  get numLitPixels() {
    return this.data.reduce(
      (acc, row) => row.reduce((racc, p) => racc + (p === "#" ? 1 : 0), acc),
      0
    );
  }
  getPixel(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return this.infinite;
    return this.data[y][x];
  }
  getPixelValue(x, y) {
    const pixel = this.getPixel(x, y);
    return pixel === "#" ? 1 : 0;
  }
  getEnhancedPixelValue(algo, x, y) {
    let binValue = "";
    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx) {
        const tx = x + dx;
        const ty = y + dy;
        binValue += this.getPixelValue(tx, ty);
      }
    }
    const index = parseInt(binValue, 2);
    return algo[index];
  }
  enhance(algo) {
    const enhanced = [];
    const e = 1;

    for (let y = -e; y < this.h + e; ++y) {
      enhanced.push([]);
      for (let x = -e; x < this.w + e; ++x) {
        const v = this.getEnhancedPixelValue(algo, x, y);
        enhanced[y + e][x + e] = v;
      }
    }

    this.data = enhanced;
    this.infinite = this.infinite === "." ? algo[0] : algo[algo.length - 1];
  }
  render() {
    let str = "";

    for (let y = -3; y < this.h + 3; ++y) {
      for (let x = -3; x < this.w + 3; ++x) {
        str += this.getPixel(x, y);
      }
      str += "\n";
    }

    console.log(str);
  }
}

const parseInput = ([algo, ...image]) => ({
  algo,
  image: new Image(image.map((img) => img.split(""))),
});

function part1(lines) {
  let { algo, image } = parseInput(lines);

  image.enhance(algo);
  image.enhance(algo);

  return image.numLitPixels;
}

function part2(lines) {
  let { algo, image } = parseInput(lines);

  for (let i = 0; i < 50; ++i) {
    image.enhance(algo);
  }

  return image.numLitPixels;
}

const resultPart1 = part1(copyLines(VALUES));
const resultPart2 = part2(copyLines(VALUES));

print(resultPart1, resultPart2);
