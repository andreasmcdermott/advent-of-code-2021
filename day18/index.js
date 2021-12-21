const { input, print } = require("utils");

class Number {
  static parse(str) {
    let stack = [];
    let root = null;
    let i = 0;
    while (i < str.length) {
      if (str[i] === "[") {
        const p = [];
        if (stack.length) {
          stack[stack.length - 1].push(p);
        }
        stack.push(p);
      } else if (/\d+/.test(str[i])) {
        stack[stack.length - 1].push(parseInt(str[i], 10));
      } else if (str[i] === "]") {
        root = stack.pop();
      }

      ++i;
    }

    return Number.build(root);
  }
  static build(v) {
    if (typeof v === "number") return v;
    const [left, right] = v;
    return new Number(Number.build(left), Number.build(right));
  }
  static add(n1, n2) {
    return new Number(n1, n2);
  }
  static reduce(n) {
    let i = 0;
    while (true) {
      if (n.needExplosion) {
        n.explode();
      } else if (n.needSplit) {
        n.split();
      } else {
        break;
      }
    }
    return n;
  }

  constructor(l, r, p = null) {
    this.l = l;
    this.r = r;
    this.parent = p;

    if (!this.lnum) this.l.parent = this;
    if (!this.rnum) this.r.parent = this;
  }

  get rnum() {
    return typeof this.r === "number";
  }
  get lnum() {
    return typeof this.l === "number";
  }
  get reg() {
    return typeof this.x === "number" && typeof this.y === "number";
  }
  get magnitude() {
    const l = this.lnum ? this.l : this.l.magnitude;
    const r = this.rnum ? this.r : this.r.magnitude;

    return 3 * l + 2 * r;
  }
  get depth() {
    if (!this.parent) return 0;
    return this.parent.depth + 1;
  }
  get needExplosion() {
    if (this.depth >= 4) {
      return true;
    }
    if (!this.lnum && this.l.needExplosion) return true;
    if (!this.rnum && this.r.needExplosion) return true;
    return false;
  }

  get needSplit() {
    if (this.lnum && this.l >= 10) return true;
    if (!this.lnum && this.l.needSplit) return true;
    if (this.rnum && this.r >= 10) return true;
    if (!this.rnum && this.r.needSplit) return true;
    return false;
  }

  copy() {
    return new Number(
      this.lnum ? this.l : this.l.copy(),
      this.rnum ? this.r : this.r.copy()
    );
  }

  addToClosestLeft() {
    let found = null;
    let last = this;
    let n = this.parent;

    while (n && !found) {
      if (n.l === last) {
        last = n;
        n = n.parent;
      } else if (n.lnum) {
        n.l += this.l;
        return;
      } else {
        found = n.l;
      }
    }

    while (found && !found.rnum) {
      found = found.r;
    }

    if (found) found.r += this.l;
  }

  addToClosestRight() {
    let found = null;
    let last = this;
    let n = this.parent;

    while (n && !found) {
      if (n.r === last) {
        last = n;
        n = n.parent;
      } else if (n.rnum) {
        n.r += this.r;
        return;
      } else found = n.r;
    }

    while (found && !found.lnum) {
      found = found.l;
    }

    if (found) found.l += this.r;
  }

  remove() {
    if (this.parent.l === this) this.parent.l = 0;
    if (this.parent.r === this) this.parent.r = 0;
  }

  explode() {
    if (this.lnum && this.rnum && this.depth >= 4) {
      this.addToClosestLeft();
      this.addToClosestRight();
      this.remove();
      return true;
    }

    let exploded = false;
    if (!this.lnum) exploded = this.l.explode();
    if (!this.rnum && !exploded) exploded = this.r.explode();

    return exploded;
  }

  split() {
    let splitted = false;

    if (this.lnum && this.l >= 10) {
      this.l = new Number(Math.floor(this.l / 2), Math.ceil(this.l / 2), this);
      return true;
    } else if (!this.lnum) splitted = this.l.split();

    if (!splitted && this.rnum && this.r >= 10) {
      this.r = new Number(Math.floor(this.r / 2), Math.ceil(this.r / 2), this);
      return true;
    } else if (!splitted && !this.rnum) splitted = this.r.split();

    return splitted;
  }

  toString() {
    return `[${this.lnum ? this.l : this.l.toString()},${
      this.rnum ? this.r : this.r.toString()
    }]`;
  }
}

const mapLine = (line) => {
  return Number.parse(line);
};

const VALUES = input(mapLine);
const copyLines = (lines) => [...lines.map((line) => line.copy())];

function part1(lines) {
  while (lines.length > 1) {
    const num1 = lines.shift();
    const num2 = lines.shift();
    const sum = Number.add(num1, num2);
    Number.reduce(sum);
    lines.unshift(sum);
  }
  return {
    num: lines[0].toString(),
    magnitude: lines[0].magnitude,
  };
}

function part2(lines) {
  let largest = 0;
  for (let i = 0; i < lines.length; ++i) {
    for (let j = 0; j < lines.length; ++j) {
      if (i === j) continue;
      const num = Number.reduce(Number.add(lines[i].copy(), lines[j].copy()));
      const sum = num.magnitude;
      if (sum > largest) largest = sum;
    }
  }
  return largest;
}

const resultPart1 = part1(copyLines(VALUES));
const resultPart2 = part2(copyLines(VALUES));

print(resultPart1, resultPart2);
