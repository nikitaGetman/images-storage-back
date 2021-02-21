const cheerio = require("cheerio");
const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const request = require("request");
const uuid = require("uuid");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "download-images-from-web";

function downloadImage(uri, toFolder, name = uuid.v4()) {
  const extension = uri.split(".").pop();
  const filePath = `${toFolder}/${name}.${extension}`;
  request(uri)
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      console.log(`image from ${uri} saved as ${name}.${extension}`);
    });
}

class DownloadFromWebPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(`/${PLUGIN_NAME}`, checkAuth, (req, res) =>
      this.downloadImagesFromUrl(req, res)
    );
  }

  downloadImagesFromUrl(req, res) {
    const { url } = req.body;
    const images = [];

    request(url, (err, _, body) => {
      if (err) {
        console.log(err);
        throw err;
      }
      const $ = cheerio.load(body);

      $("img").each((_, el) => {
        const src = $(el).attr("src");

        if (src && !src.includes("svg")) {
          images.push(src);
        }
      });

      const path = `./database/${req.userId}`;
      images.forEach((src) => downloadImage(src, path));

      res.send(images);
    });
  }
}

module.exports = DownloadFromWebPlugin;
