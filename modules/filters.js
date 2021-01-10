const fs = require("fs");
const BaseModule = require("./static/base");

const MODULE_NAME = "filters";

class FiltersModule extends BaseModule {
  constructor(db) {
    super(MODULE_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(`/${MODULE_NAME}`, this.getFilteredFiles);
  }

  getFilteredFiles(req, res) {
    const nameFilter = req.query.name || "";
    const path = "./database/";
    const files = fs.readdirSync(path);
    const filteredFiles = files.filter((f) => f.includes(nameFilter));
    res.send(filteredFiles);
  }
}

module.exports = FiltersModule;
