const fs = require("fs");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "filters";

class FiltersPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(`/${PLUGIN_NAME}`, this.getFilteredFiles);
  }

  getFilteredFiles(req, res) {
    const nameFilter = req.query.name || "";
    const path = "./database/";
    const files = fs.readdirSync(path);
    const filteredFiles = files.filter((f) => f.includes(nameFilter));
    res.send(filteredFiles);
  }
}

module.exports = FiltersPlugin;
