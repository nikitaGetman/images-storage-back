const express = require("express");
const router = express.Router();
const fs = require("fs");
const app = express();
const dbDriver = require("./dbDriver");

const port = 3000;

// register plugins from plugins folder
const pluginsList = [];
const pluginsFolder = "./plugins/";

fs.readdirSync(pluginsFolder).forEach((file) => {
  const path = `${pluginsFolder}${file}`;

  if (fs.statSync(path).isFile()) {
    const pluginClass = require(path);
    const pluginInstance = new pluginClass(dbDriver);

    const name = pluginInstance.getName();

    app.use(pluginInstance.getRouter());
    pluginsList.push(name);
  }
});

console.log("Installed plugins: ", pluginsList);

// static directory
app.use("/images", express.static("database"));

app.get("/plugins", (req, res) => {
  res.send(pluginsList);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
