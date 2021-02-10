const fs = require("fs");
const BasePlugin = require("./base");
const checkAuth = require("../../middlewares/checkAuth");
const dbDriver = require("../../dbDriver");
const jwt = require("jsonwebtoken");
const { token } = require("../../config.json");

const PLUGIN_NAME = "user";

class UserPlugin extends BasePlugin {
  constructor(db, plugins) {
    super(PLUGIN_NAME, db);
    this.plugins = plugins;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(`/${PLUGIN_NAME}/login/`, (req, res) =>
      this.loginRoute(req, res)
    );
    this.router.post(`/${PLUGIN_NAME}/signup/`, (req, res) =>
      this.signupRoute(req, res)
    );
    this.router.get(`/${PLUGIN_NAME}/me/`, checkAuth, (req, res) =>
      this.meRoute(req, res)
    );
    this.router.post(`/${PLUGIN_NAME}/plugins/`, checkAuth, (req, res) =>
      this.setPluginsRoute(req, res)
    );
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
    const user = await this.getUserById(req.userId);
    if (user) {
      res.send(user);
    } else {
      res.status(401).send({ error: "Cannot get current user." });
    }
  }

  async setPluginsRoute(req, res) {
    const updateResult = await this.setUserPlugins(req.userId, req.body);
    if (!updateResult)
      return res.status(400).send({ error: "Cannot update user plugins." });

    return res.send({ message: "ok" });
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

    const dir = `./database/${rows.insertId}/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    return rows.affectedRows > 0;
  }

  async getUserById(id) {
    if (!id) return null;

    const [rows] = await dbDriver.getUserById(id);
    if (rows.length > 0) {
      const { name, plugins: pluginsBiteString } = rows[0];
      const plugins = [];
      pluginsBiteString.split("").forEach((bit, index) => {
        if (bit === "1") plugins.push(this.plugins[index]);
      });
      return { name, plugins };
    }
    return null;
  }

  async setUserPlugins(id, { plugins }) {
    let pluginsBiteString = "";
    this.plugins.forEach((plugin) => {
      const isPluginOn = plugins.indexOf(plugin) !== -1;
      pluginsBiteString = `${pluginsBiteString}${isPluginOn ? 1 : 0}`;
    });

    if (!id) return null;
    const [rows] = await dbDriver.setUserPlugins(id, pluginsBiteString);

    return rows.affectedRows > 0;
  }
}

module.exports = UserPlugin;
