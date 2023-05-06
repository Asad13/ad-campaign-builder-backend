/** @type {object} - Handles all the routes for User and Authentication */
const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../../controllers/v1/authController");
const authorize = require("../../middlewares/v1/authorize");

router
  .route("/signup")
  .post(
    body("company_name").not().isEmpty().trim().escape(),
    body("email").not().isEmpty().trim().isEmail(),
    body("password").isLength({ min: 8 }),
    authController.createUser
  );

router
  .route("/login")
  .post(
    body("email").not().isEmpty().trim().isEmail(),
    body("password").isLength({ min: 8 }),
    authController.authenticateUser
  );

router
  .route("/access")
  .get(authorize.verifyRefreshToken, authController.getNewAccessToken);

router
  .route("/token")
  .get(authorize.verifyRefreshToken, authController.generateNewAccessToken);

router
  .route("/logout")
  .post(authorize.verifyAccessToken, authController.logout);

router.route("/confirm-email/:token").get(authController.verifyUser);

router
  .route("/forgot-password")
  .post(
    body("email").not().isEmpty().trim().isEmail(),
    authController.forgotPassword
  );

router.route("/forgot-password/:token").get(authController.verifyResetPassword);

router
  .route("/reset-password/:token")
  .post(
    body("password").isLength({ min: 8 }),
    body("confirmPassword").isLength({ min: 8 }),
    authController.resetPassword
  );

router.route("/invitation/:token").get(authController.verifySetPassword);

router
  .route("/set-new-password/:token")
  .post(
    body("password").isLength({ min: 8 }),
    body("confirmPassword").isLength({ min: 8 }),
    authController.setPassword
  );

module.exports = router;
