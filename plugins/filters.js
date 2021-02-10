const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "image-filters";

class FiltersPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(`/${PLUGIN_NAME}`, checkAuth, (req, res) =>
      this.getFilteredFiles(req, res)
    );
  }

  getFilteredFiles(req, res) {
    const nameFilter = req.query.name || "";
    const path = `./database/${req.userId}`;
    const files = fs.readdirSync(path);
    const filteredFiles = files.filter((f) => f.includes(nameFilter));
    res.send(filteredFiles);
  }
}

module.exports = FiltersPlugin;
