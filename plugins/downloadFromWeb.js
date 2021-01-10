const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");
const uuid = require("uuid");
const BasePlugin = require("./static/base");

const PLUGIN_NAME = "download-from-web";

function downloadImage(uri, name = uuid.v4()) {
  const folder = "./database";
  const extension = uri.split(".").pop();
  const filePath = `${folder}/${name}.${extension}`;
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
    this.router.get(`/${PLUGIN_NAME}`, this.downloadImagesFromUrl);
    this.router.post(`/${PLUGIN_NAME}`, this.downloadImagesFromUrl);
  }

  downloadImagesFromUrl(req, res) {
    const url = req.params.url || req.query.url;
    const images = [];

    request(url, function (err, _, body) {
      if (err) throw err;
      const $ = cheerio.load(body);

      $("img").each((_, el) => {
        const src = $(el).attr("src");

        if (src && !src.includes("svg")) {
          images.push(src);
        }
      });

      images.forEach((src) => downloadImage(src));

      res.send(images);
    });
  }
}

module.exports = DownloadFromWebPlugin;
