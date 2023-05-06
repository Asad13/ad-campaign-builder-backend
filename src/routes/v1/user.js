/** @type {object} - Handles all the routes for User and Authentication */
const router = require("express").Router();
const { body } = require("express-validator");
const userController = require("../../controllers/v1/userController");
const authorize = require("../../middlewares/v1/authorize");
const multerProfilePic = require("../../middlewares/v1/multerProfilePic");

router
  .route("/")
  .all(authorize.verifyAccessToken)
  .get(authorize.verifyAdmin, userController.getAllUsers)
  .post(
    body("name").not().isEmpty().trim().escape(),
    body("company_name").not().isEmpty().trim().escape(),
    body("category_id").not().isEmpty().trim().escape(),
    body("subcategory_id").not().isEmpty().trim().escape(),
    userController.updateUserData
  );

router
  .route("/roles")
  .all(authorize.verifyAccessToken)
  .get(userController.getRoles);

router
  .route("/password")
  .all(authorize.verifyAccessToken)
  .post(
    body("password").isLength({ min: 8 }),
    body("newPassword").isLength({ min: 8 }),
    body("confirmNewPassword").isLength({ min: 8 }),
    userController.updatePassword
  );

router
  .route("/invite")
  .all(authorize.verifyAccessToken)
  .post(
    authorize.verifyAdmin,
    body("name").not().isEmpty().trim().escape(),
    body("email").not().isEmpty().trim().isEmail(),
    userController.inviteUser
  );

router
  .route("/invite/resend")
  .all(authorize.verifyAccessToken)
  .post(
    authorize.verifyAdmin,
    userController.resendInvite
  );

router
  .route("/:id")
  .all(authorize.verifyAccessToken)
  .get(userController.getUserData)
  .delete(authorize.verifyAdmin, userController.deleteUser);

router
  .route("/role/:id")
  .all(authorize.verifyAccessToken)
  .put(authorize.verifyAdmin, userController.updateUserRole);

module.exports = router;
