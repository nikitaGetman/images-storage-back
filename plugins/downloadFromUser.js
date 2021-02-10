const BasePlugin = require("./static/base");
const checkAuth = require("../middlewares/checkAuth");

const PLUGIN_NAME = "download-image-from-user";

class DownloadFromUserPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(`/${PLUGIN_NAME}`, checkAuth, this.downloadImageFromUser);
  }

  downloadImageFromUser(req, res) {
    try {
      if (!req.files) {
        res.send({ error: "No file uploaded" });
      } else {
        const image = req.files.image;
        image.mv(`./database/${req.userId}/` + image.name);

        res.send({
          message: "File is uploaded",
          data: {
            name: image.name,
            mimetype: image.mimetype,
            size: image.size,
          },
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

module.exports = DownloadFromUserPlugin;
