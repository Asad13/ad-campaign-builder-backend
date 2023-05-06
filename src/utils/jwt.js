const jwt = require("jsonwebtoken");

/**
 * Generates new Access Token
 * @function
 * @name generateAccessToken
 * @param {object} payload
 */
module.exports.generateAccessToken = function (payload) {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_MAX_AGE,
  });
  return accessToken;
};

/**
 * Generates new Refresh Token
 * @function
 * @name generateRefreshToken
 * @param {object} payload
 */
module.exports.generateRefreshToken = function (payload) {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_MAX_AGE,
  });
  return refreshToken;
};

/**
 * Generates new email Token for Email Verification
 * @function
 * @name generateEmailToken
 * @param {object} payload
 */
module.exports.generateEmailToken = function (payload) {
  const emailToken = jwt.sign(payload, process.env.EMAIL_VERIFICATION_TOKEN_SECRET_KEY, {
    expiresIn: process.env.EMAIL_TOKEN_MAX_AGE,
  });
  return emailToken;
};

/**
 * Generates new email Token for Email Verification of invited user
 * @function
 * @name generateInviteUserToken
 * @param {object} payload
 */
module.exports.generateInviteUserToken = function (payload) {
  const emailToken = jwt.sign(payload, process.env.INVITE_USER_TOKEN_SECRET_KEY, {
    expiresIn: process.env.EMAIL_TOKEN_MAX_AGE,
  });
  return emailToken;
};

/**
 * Generates new token for forgot password
 * @function
 * @name generatePasswordForgotToken
 * @param {object} payload
 */
module.exports.generatePasswordForgotToken = function (payload) {
  const passwordForgotToken = jwt.sign(payload, process.env.PASSWORD_FORGOT_TOKEN_SECRET_KEY, {
    expiresIn: process.env.PASSWORD_FORGOT_TOKEN_MAX_AGE,
  });
  return passwordForgotToken;
};

/**
 * Generates new token to reset password
 * @function
 * @name generatePasswordResetToken
 * @param {object} payload
 */
module.exports.generatePasswordResetToken = function (payload) {
  const passwordResetToken = jwt.sign(payload, process.env.PASSWORD_RESET_TOKEN_SECRET_KEY, {
    expiresIn: process.env.PASSWORD_RESET_TOKEN_MAX_AGE,
  });
  return passwordResetToken;
};

/**
 * Generates new token to set password
 * @function
 * @name generatePasswordSetToken
 * @param {object} payload
 */
module.exports.generatePasswordSetToken = function (payload) {
  const passwordSetToken = jwt.sign(payload, process.env.PASSWORD_SET_TOKEN_SECRET_KEY, {
    expiresIn: process.env.PASSWORD_RESET_TOKEN_MAX_AGE,
  });
  return passwordSetToken;
};
