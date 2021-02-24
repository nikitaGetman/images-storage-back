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

  async downloadImagesFromUrl(req, res) {
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

        if (src && !src.includes("svg") && !images.includes(src)) {
          if (src.startsWith("http")) {
            images.push(src);
          } else {
            images.push(url + src);
          }
        }
      });
      console.log(images);
      const path = `./database/${req.userId}`;
      images.forEach(async (src) => {
        downloadImage(src, path)
        await this.db.addUserImage(req.userId, image.name)
      });

      res.send(images);
    });
  }
}

module.exports = DownloadFromWebPlugin;
