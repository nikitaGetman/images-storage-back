const jwt = require("jsonwebtoken");
const { token: tokenKey } = require("../config.json");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = await jwt.verify(token, tokenKey);
    if (!data || !data.id) {
      throw new Error();
    }
    req.userId = data.id;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized." });
  }
};

module.exports = checkAuth;
