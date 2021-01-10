const fs = require("fs");
const BaseModule = require("./static/base");

const MODULE_NAME = "list";

class ListModule extends BaseModule {
  constructor(db) {
    super(MODULE_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(`/${MODULE_NAME}`, this.getAllImages);
  }

  getAllImages(res, req) {
    const path = "./database/";
    const files = fs.readdirSync(path);
    req.send(files);
  }
}

module.exports = ListModule;
