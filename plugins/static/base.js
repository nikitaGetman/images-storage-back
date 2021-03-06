const express = require("express");
const router = express.Router();

class BasePlugin {
  constructor(name, db) {
    this.name = name;
    this.router = router;
    this.db = db;
  }

  getName() {
    return this.name;
  }

  getRouter() {
    return this.router;
  }
}

module.exports = BasePlugin;
