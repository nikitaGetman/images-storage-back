const BasePlugin = require("./static/base");

const PLUGIN_NAME = "download-from-user";

class DownloadFromUserPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(`/${PLUGIN_NAME}`, this.downloadImageFromUser);
  }

  downloadImageFromUser(req, res) {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        const image = req.files.image;
        image.mv("./database/" + image.name);

        res.send({
          status: true,
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
