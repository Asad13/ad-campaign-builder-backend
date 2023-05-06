const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const authService = require("../../services/v1/authService");
const userService = require("../../services/v1/userService");
const authorize = require("../../middlewares/v1/authorize");
const createCookie = require("../../utils/createCookie");
const emailSender = require("../../utils/emailTransporter");
const tokenGenerator = require("../../utils/jwt");
const { getFileUrl } = require("../../database/aws_s3");

/**
 * Verifies new user when they click on Email Verification and redirects to Login page if verified
 * @function
 * @name verifyUser
 * @param {object} req
 * @param {object} res
 */
const verifyUser = async (req, res) => {
  try {
    const user = jwt.verify(
      req.params?.token,
      process.env.EMAIL_VERIFICATION_TOKEN_SECRET_KEY
    );
    await authService.verifyUser(user.sub);
    const group_id = await authService.createGroup(user.name); // Only for admin
    await authService.addUserGroup(user.sub, group_id);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  } catch (e) {
    console.log(e);
    res.send("error");
  }
};

/**
 * Creates new User upon signup
 * @function
 * @name createUser
 * @param {object} req
 * @param {object} res
 */
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "", error: errors.array() });
  }

  try {
    let user = await authService.authenticateUser(req.body.email);
    if (user) {
      return res.json({ status: false, message: "Email already exists" });
    }

    user = _.pick(req.body, ["company_name", "email", "password"]);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.role_id = 1; // Admin
    const newUser = await authService.createUser(user);

    const payload = {
      sub: newUser.id,
      name: newUser.company_name,
      iat: Date.now(),
    };

    const emailToken = tokenGenerator.generateEmailToken(payload);
    const url = `${process.env.SERVER_URL}/api/v1/auth/confirm-email/${emailToken}`;

    const info = await emailSender(
      user.email,
      "Campaign Builder - Email Verification",
      `Please click this link to confirm your email: <a href="${url}">${url}</a>`
    );

    return res.status(201).json({
      status: true,
      message: "Confirm your email",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Authenticate user when they signin, sets refreshToken(httponly cookie) and provides accessToken
 * @function
 * @name authenticateUser
 * @param {object} req
 * @param {object} res
 */
const authenticateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid email or password." });
  }

  try {
    let user = await authService.authenticateUser(req.body.email);
    if (!user)
      return res.json({ status: false, message: "Invalid email or password." });
    if (!user.is_verified)
      return res.json({ status: false, message: "Email not Verified." });

    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (!validUser)
      return res.json({ status: false, message: "Invalid email or password." });

    user.role = await authService.getUserRole(user.role_id);

    const { accessToken, refreshToken } = await authorize.handleTokens(
      user.id,
      user.company_name,
      user.role
    );
    res.cookie(createCookie.createRefreshTokenCookie(refreshToken));

    let imageUrl = "";
    if (user.profile_pic) {
      imageUrl = await getFileUrl(user.profile_pic);
    }

    return res.status(200).json({
      status: true,
      message: "Login Successful",
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name ?? "",
          role: user.role ?? "",
          email: user.email,
          category_id: user.category_id ? `${user.category_id}` : "",
          subcategory_id: user.subcategory_id ? `${user.subcategory_id}` : "",
          imageUrl: imageUrl,
          company_name: user.company_name,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Provides new accessToken when the user requests with a valid refreshToken
 * @function
 * @name generateNewAccessToken
 * @param {object} req
 * @param {object} res
 */
const generateNewAccessToken = async (req, res) => {
  try {

    const user = await authService.getUser(req.user.id);

    user.role = await userService.getUserRole(user.role_id);

    const { accessToken, refreshToken } = await authorize.handleTokens(
      user.id,
      user.company_name,
      user.role
    );

    res.cookie(createCookie.createRefreshTokenCookie(refreshToken));

    let imageUrl = "";
    if (user.profile_pic) {
      imageUrl = await getFileUrl(user.profile_pic);
    }

    return res.status(200).json({
      status: true,
      message: "Success",
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name ?? "",
          role: user.role ?? "",
          email: user.email,
          category_id: user.category_id ? `${user.category_id}` : "",
          subcategory_id: user.subcategory_id ? `${user.subcategory_id}` : "",
          imageUrl: imageUrl,
          company_name: user.company_name,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Provides new accessToken when the user requests with a valid refreshToken
 * @function
 * @name getNewAccessToken
 * @param {object} req
 * @param {object} res
 */
const getNewAccessToken = async (req, res) => {
  try {

    const user = await authService.getUser(req.user.id);

    user.role = await userService.getUserRole(user.role_id);

    const accessToken = await authorize.createAccessToken(
      user.id,
      user.company_name,
      user.role
    );

    let imageUrl = "";
    if (user.profile_pic) {
      imageUrl = await getFileUrl(user.profile_pic);
    }

    return res.status(200).json({
      status: true,
      message: "Success",
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name ?? "",
          role: user.role ?? "",
          email: user.email,
          category_id: user.category_id ? `${user.category_id}` : "",
          subcategory_id: user.subcategory_id ? `${user.subcategory_id}` : "",
          imageUrl: imageUrl,
          company_name: user.company_name,
          address : user.address ?? "",
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Sends Token through email to reset password
 * @function
 * @name forgotPassword
 * @param {object} req
 * @param {object} res
 */
const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ status: false, message: "Invalid Email" });
  }

  try {
    let user = await authService.authenticateUser(req.body.email);
    if (!user) {
      return res.json({ status: false, message: "Email not registered" });
    }
    if (!user.is_verified)
      return res.json({ status: false, message: "Email not Verified." });

    const payload = {
      sub: user.id,
      name: user.company_name,
      iat: Date.now(),
    };

    const passwordForgotToken =
      tokenGenerator.generatePasswordForgotToken(payload);
    const url = `${process.env.SERVER_URL}/api/v1/auth/forgot-password/${passwordForgotToken}`;

    const info = await emailSender(
      user.email,
      "Campaign Builder - Reset Password",
      `Please click this link to reset your password: <a href="${url}">${url}</a>`
    );

    return res.status(200).json({
      status: true,
      message: "Email sent to reset password",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Verifies token to allow password reset
 * @function
 * @name verifyResetPassword
 * @param {object} req
 * @param {object} res
 */
const verifyResetPassword = async (req, res) => {
  try {
    const user = jwt.verify(
      req.params?.token,
      process.env.PASSWORD_FORGOT_TOKEN_SECRET_KEY
    );

    const payload = {
      sub: user.sub,
      name: user.name,
      iat: Date.now(),
    };

    const passwordResetToken =
      tokenGenerator.generatePasswordResetToken(payload);

    return res.redirect(
      `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`
    );
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};


/**
 * Verifies token to allow to set password for new User
 * @function
 * @name verifySetPassword
 * @param {object} req
 * @param {object} res
 */
const verifySetPassword = async (req, res) => {
  try {
    const user = jwt.verify(
      req.params?.token,
      process.env.INVITE_USER_TOKEN_SECRET_KEY
    );

    const payload = {
      sub: user?.sub,
      name: user?.name,
      role: user?.role,
      iat: Date.now(),
    };

    const passwordSetToken =
      tokenGenerator.generatePasswordSetToken(payload);

    return res.redirect(
      `${process.env.CLIENT_URL}/set-password/${passwordSetToken}`
    );
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Resets user's password
 * @function
 * @name resetPassword
 * @param {object} req
 * @param {object} res
 */
const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ status: false, message: "Password is too short" });
  }

  try {
    const user = jwt.verify(
      req.params?.token,
      process.env.PASSWORD_RESET_TOKEN_SECRET_KEY
    );

    if (req.body.password !== req.body.confirmPassword) {
      return res.json({ status: false, message: "Password Mismatch" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const updatedUser = await authService.updatePassword(user.sub, {
      password: newPassword,
    });

    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Password reset failed",
    });
  }
};

/**
 * Sets new user's(Invited) password
 * @function
 * @name setPassword
 * @param {object} req
 * @param {object} res
 */
const setPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ status: false, message: "Password is too short" });
  }

  try {
    const user = jwt.verify(
      req.params?.token,
      process.env.PASSWORD_SET_TOKEN_SECRET_KEY
    );

    if (req.body.password !== req.body.confirmPassword) {
      return res.json({ status: false, message: "Password Mismatch" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const updatedUser = await authService.updatePassword(user.sub, {
      password: newPassword,
      is_verified: true
    });

    return res.status(200).json({
      status: true,
      message: "Password set successfully",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Password set failed",
    });
  }
};

/**
 * Logs out user and delete refreshToken cookie
 * @function
 * @name logout
 * @param {object} req
 * @param {object} res
 */
const logout = async (req, res) => {
  try {
    authorize.deleteRefreshToken(req.user.id, req.token);
    res.cookie(createCookie.deleteRefreshTokenCookie());

    return res.status(204).json({
      status: true,
      message: "Logout Successful",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = {
  verifyUser,
  createUser,
  authenticateUser,
  generateNewAccessToken,
  getNewAccessToken,
  forgotPassword,
  verifySetPassword,
  verifyResetPassword,
  setPassword,
  resetPassword,
  logout,
};
