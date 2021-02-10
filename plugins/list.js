const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "images-list";

class ListPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(`/${PLUGIN_NAME}`, checkAuth, this.getAllImages);
  }

  getAllImages(req, res) {
    const path = `./database/${req.userId}`;
    const files = fs.readdirSync(path);
    res.send(files);
  }
}

module.exports = ListPlugin;
