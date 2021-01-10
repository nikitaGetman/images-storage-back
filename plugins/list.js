const fs = require("fs");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "list";

class ListPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(`/${PLUGIN_NAME}`, this.getAllImages);
  }

  getAllImages(res, req) {
    const path = "./database/";
    const files = fs.readdirSync(path);
    req.send(files);
  }
}

module.exports = ListPlugin;
