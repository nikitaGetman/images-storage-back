const express = require("express");
const fs = require("fs");
const app = express();
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const dbDriver = require("./dbDriver");

const port = process.env.PORT || 3000;

// basic middlewares
app.use("/images", express.static("database"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

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

app.get("/plugins", (req, res) => {
  res.send(pluginsList);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
