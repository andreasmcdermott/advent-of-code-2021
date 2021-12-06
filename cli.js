const fs = require("fs");
const path = require("path");
const ps = require("child_process");

const commands = {
  add: (days) => {
    if (!days) days = [];
    if (!days.length) days.push(new Date().getDate());
    days.forEach((day) => {
      const folder = `day${day}`;
      if (fs.existsSync(path.resolve(__dirname, folder))) {
        console.log(`Folder ${folder} already exist. Will not overwrite!`);
      } else {
        fs.mkdirSync(path.resolve(__dirname, folder));
        fs.writeFileSync(
          path.resolve(__dirname, folder, "index.js"),
          "",
          "utf8"
        );
        fs.writeFileSync(
          path.resolve(__dirname, folder, "input.txt"),
          "",
          "utf8"
        );
      }
    });
  },
  run: (days) => {
    if (!days) days = [];
    if (days.length === 1 && days[0] === "all") {
      days.pop();
      const today = new Date().getDate();
      for (let i = 1; i <= today; ++i) {
        days.push(String(i));
      }
    }
    if (!days.length) days.push(new Date().getDate());
    days.forEach((day) => {
      const folder = `day${day}`;
      if (fs.existsSync(path.resolve(__dirname, folder))) {
        console.log(`Day ${day}:\n`);
        ps.execSync(`node ./${folder}`, { stdio: "inherit" });
        console.log("");
      } else {
        console.log(`Day ${day}:\n\nUnavailable\n`);
      }
    });
  },
};

const [, , cmd, ...options] = process.argv;
if (commands[cmd]) {
  commands[cmd](options);
} else {
  console.log(
    `Command "${cmd}" is not valid. Valid commands: ${Object.keys(
      commands
    ).join(", ")}`
  );
}
