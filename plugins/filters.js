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

  async getFilteredFiles(req, res) {
    const nameFilter = req.query.name || "";
    const tagFilter = req.query.tag || null
    const [rows] = await this.db.getUserImages(req.userId)
    
    const filtered = rows.filter(r => r.name.includes(nameFilter)).filter(r => r.tag == tagFilter)

    res.send(filtered);
  }
}

module.exports = FiltersPlugin;
