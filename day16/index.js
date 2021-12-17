const { input, print } = require("utils");

const mapLine = (line) =>
  line
    .split("")
    .map((h) => parseInt(h, 16).toString(2).padStart(4, "0"))
    .join("");

const VALUES = input(mapLine);
const copyLines = (lines) => [...lines];

const binToDec = (str) => {
  return parseInt(str.padStart(4, "0"), 2);
};

const Message = (msg) => {
  const rd = (num) => {
    const str = msg.substr(0, num);
    msg = msg.substr(num);
    return str;
  };
  return {
    take(num) {
      return binToDec(rd(num));
    },
    takeRaw(num) {
      return rd(num);
    },
    get current() {
      return msg;
    },
    get size() {
      return msg.length;
    },
  };
};

const readLiteral = (message) => {
  let binValue = "";
  while (true) {
    const leading = message.takeRaw(1);
    binValue += message.takeRaw(4);
    if (leading === "0") return binToDec(binValue);
  }
};

const readSubPackets = (message) => {
  const packets = [];
  const lengthType = message.take(1);
  if (lengthType === 0) {
    let lengthInBits = message.take(15);
    while (lengthInBits > 0) {
      const packet = readPacket(message);
      packets.push(packet);
      lengthInBits -= packet.size;
    }
  } else if (lengthType === 1) {
    const lengthInPackets = message.take(11);
    for (let i = 0; i < lengthInPackets; ++i) {
      packets.push(readPacket(message));
    }
  } else {
    throw new Error("invalid");
  }

  return packets;
};

const readPacket = (message) => {
  let bitsBefore = message.size;
  const version = message.take(3);
  const type = message.take(3);
  let data = null;
  if (type === 4) {
    data = { value: readLiteral(message) };
  } else {
    data = { packets: readSubPackets(message) };
  }

  return { version, type, ...data, size: bitsBefore - message.size };
};

const sumVersion = (packet) => {
  if (!packet) return 0;
  let score = packet.version || 0;

  (packet.packets || []).forEach((p) => {
    score += sumVersion(p);
  });

  return score;
};

const reducers = {
  0: (acc, v) => acc + v,
  1: (acc, v) => acc * v,
  2: (acc, v) => (v < acc ? v : acc),
  3: (acc, v) => (v > acc ? v : acc),
  5: (acc, v) => (acc > v ? 1 : 0),
  6: (acc, v) => (acc < v ? 1 : 0),
  7: (acc, v) => (acc == v ? 1 : 0),
};

const calculate = (packet) => {
  const { type, value, packets } = packet;
  if (type === 4) return value;

  const values = (packets || []).map((p) => calculate(p));

  return values.reduce(reducers[type]);
};

function part1(packets) {
  const parsedPackets = packets.map(Message).map(readPacket);
  return sumVersion(parsedPackets[0]);
}

function part2(packets) {
  const parsedPackets = packets.map(Message).map(readPacket);
  return calculate(parsedPackets[0]);
}

const resultPart1 = part1(copyLines(VALUES));
const resultPart2 = part2(copyLines(VALUES));

print(resultPart1, resultPart2);
