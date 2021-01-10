const fs = require("fs");

function addModule(name, toPath = "./plugins/") {
  fs.rename(name, `${toPath}${name}`, (err) => {
    if (err) throw err;
    console.log("Module successfully added!");
  });
}

const { argv } = process;
if (argv[2] === "add") addModule(argv[3]);
