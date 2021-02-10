const mysql = require("mysql2/promise");
const { db } = require("./config.json");

const driver = {
  connection: null,
  async init() {
    try {
      this.connection = await mysql.createConnection(db);
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        console.error("Cannot connect to database");
      } else {
        console.error(err);
      }
    }
  },
  async getConnection() {
    if (!this.connection) await this.init();
    return this.connection;
  },
  async exec(sql, params) {
    if (!sql) {
      console.error("EMPTY SQL", params);
      return;
    }
    const conn = await this.getConnection();
    return await conn.execute(sql, params);
  },
  disconnect() {
    this.connection.end((err) => {
      if (err) {
        console.error("Error: " + err.message);
        return;
      }
      console.log("Connection closed.");
    });
  },

  // user
  async createUser({ login, password, name }) {
    const sql =
      "INSERT INTO `storage`.`users` (`login`,`password`,`name`) VALUES(?,?,?);";
    return await this.exec(sql, [login, password, name]);
  },
  async authUser({ login, password }) {
    const sql =
      "SELECT `users`.`id`, `users`.`name` FROM `storage`.`users` WHERE `users`.`login` = ? and `users`.`password` = ?;";
    return await this.exec(sql, [login, password]);
  },
  async getUserById(id) {
    const sql =
      "SELECT  `users`.`name`, `users`.`plugins` FROM `storage`.`users` WHERE `users`.`id` = ?;";
    return await this.exec(sql, [id]);
  },
  async setUserPlugins(id, plugins) {
    const sql = "UPDATE `storage`.`users` SET `plugins` = ? WHERE `id` = ?;";
    return await this.exec(sql, [plugins, id]);
  },
};

module.exports = driver;
