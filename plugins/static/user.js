const fs = require("fs");
const BasePlugin = require("./base");
const checkAuth = require("../../middlewares/checkAuth");
const dbDriver = require("../../dbDriver");
const jwt = require("jsonwebtoken");
const { token } = require("../../config.json");

const PLUGIN_NAME = "user";

class UserPlugin extends BasePlugin {
  constructor(db) {
    super(PLUGIN_NAME, db);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(`/${PLUGIN_NAME}/login/`, this.loginRoute);
    this.router.post(`/${PLUGIN_NAME}/signup/`, this.signupRoute);
    this.router.get(`/${PLUGIN_NAME}/me/`, checkAuth, this.meRoute);
  }

  async loginRoute(req, res) {
    const token = await this.signin(req.body);

    if (token.access) {
      res.send(token);
    } else {
      res.status(400).send(token);
    }
  }

  async signupRoute(req, res) {
    const signupResult = await this.signup(req.body);

    if (!signupResult)
      return res.status(400).send({ error: "Cannot create user." });

    return this.loginRoute(req, res);
  }

  async meRoute(req, res) {
    const user = await this.getProfileById(req.userId);
    if (user) {
      res.send(user);
    } else {
      res.status(401).send({ error: "Cannot get current user." });
    }
  }

  async signin({ login, password }) {
    if (!login || !password) return { error: "Login or password is missed." };

    const [rows] = await dbDriver.authUser({ login, password });

    if (rows.length > 0) {
      const user = rows[0];
      const access = await jwt.sign({ id: user.id }, token);
      return { access };
    } else {
      return { error: "No such user. Check login and password." };
    }
  }

  async signup({ name, login, password }) {
    const [rows] = await dbDriver.createUser({ name, login, password });

    console.log(rows);

    return rows.affectedRows > 0;
  }

  async getProfileById(id) {
    if (!id) return null;

    const [rows] = await dbDriver.getProfileById(id);
    if (rows.length > 0) return rows[0];
    return null;
  }
}

module.exports = UserPlugin;
