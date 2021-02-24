const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "images-deletion";

class DeletePlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.delete(`/${PLUGIN_NAME}`, checkAuth, (req, res) =>
      this.deleteImage(req, res)
    );
  }

   deleteImage(req, res) {
    const { image } = req.body;
    const filePath = `./database/${req.userId}/${image}`;

    fs.unlink(filePath, async (err) => {
      if (err && err.code == "ENOENT") {
        res.status(400).send({ error: "No such file." });
      } else if (err) {
        res.status(500).send({ error: err });
      } else {
        await this.db.deleteUserImage(req.userId, image)
        res.send({ message: "ok" });
      }
    });
  }
}

module.exports = DeletePlugin;
