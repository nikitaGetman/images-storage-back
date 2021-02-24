const checkAuth = require("../middlewares/checkAuth");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "images-list";

class ListPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(`/${PLUGIN_NAME}`, checkAuth, (req, res) =>
      this.getAllImages(req, res)
    );
  }

  async getAllImages(req, res) {
    const [rows] = await this.db.getUserImages(req.userId)
    res.send({media: rows});
  }
}

module.exports = ListPlugin;
