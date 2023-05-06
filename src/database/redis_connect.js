const redis = require("redis");

/** @type {object} - Connection to Redis Database */
const redis_client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

redis_client.on("connect", () => {
  console.log("Connected to Redis successfully.");
});

module.exports = redis_client;
