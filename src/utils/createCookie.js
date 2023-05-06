const { serialize } = require("cookie");

/**
 * Creates new httpOnly cookie for Refresh Token
 * @function
 * @name createRefreshTokenCookie
 * @param {string} token
 * @returns {string} A serialized httpOnly cookie
 */
const createRefreshTokenCookie = (token) => {
  const serializedCookie = serialize("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
    path: "/",
  });
  return serializedCookie;
};

/**
 * Deletes the httpOnly cookie for Refresh Token
 * @function
 * @name deleteRefreshTokenCookie
 * @returns {string} A serialized httpOnly cookie with null value
 */
const deleteRefreshTokenCookie = () => {
  const serializedCookie = serialize("token", null, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });
  return serializedCookie;
};

module.exports = {
  createRefreshTokenCookie,
  deleteRefreshTokenCookie,
};
