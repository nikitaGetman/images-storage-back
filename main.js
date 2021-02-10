const express = require("express");
const fs = require("fs");
const app = express();
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const dbDriver = require("./dbDriver");
const { port } = require("./config.json");

const UserPlugin = require("./plugins/static/user");

// basic middlewares
app.use("/images", express.static("database"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

// register plugins from plugins folder
const pluginsList = [];
const pluginsFolder = "./plugins/";

const userPlugin = new UserPlugin(dbDriver);
app.use(userPlugin.getRouter());
pluginsList.push(userPlugin.getName());

// register dynamic plugins
fs.readdirSync(pluginsFolder).forEach((file) => {
  const path = `${pluginsFolder}${file}`;

  if (fs.statSync(path).isFile()) {
    const pluginClass = require(path);
    const pluginInstance = new pluginClass(dbDriver);

    app.use(pluginInstance.getRouter());
    pluginsList.push(pluginInstance.getName());
  }
});

console.log("Installed plugins: ", pluginsList);

app.get("/plugins", (req, res) => {
  res.send(pluginsList);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
