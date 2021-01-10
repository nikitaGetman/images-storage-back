const express = require("express");
const router = express.Router();
const fs = require("fs");
const app = express();
const dbDriver = require("./dbDriver");

const port = 3000;

// register modules from modules folder
const modulesList = [];
const modulesFolder = "./modules/";

fs.readdirSync(modulesFolder).forEach((file) => {
  const path = `${modulesFolder}${file}`;

  if (fs.statSync(path).isFile()) {
    const moduleClass = require(path);
    const moduleInstance = new moduleClass(dbDriver);

    const name = moduleInstance.getName();
    const r = moduleInstance.getRouter();

    app.use(r);
    modulesList.push(name);
  }
});

console.log("Installed modules: ", modulesList);

// static directory
app.use("/images", express.static("database"));

app.get("/modules", (req, res) => {
  res.send(modulesList);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
