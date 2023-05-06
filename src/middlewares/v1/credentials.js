const allowedOrigins = require("../../config/allowedOrigins");

/**
 * Allow credentials to pass through request header for allowed origins
 * @function
 * @name credentials
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
