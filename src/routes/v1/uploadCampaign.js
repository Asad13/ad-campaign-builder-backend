const router = require("express").Router();
const uploadCampaignController = require("../../controllers/v1/uploadCampaignController");
const authorize = require("../../middlewares/v1/authorize");

router
  .route("/")
  .all(authorize.verifyAccessToken)
  .post(uploadCampaignController.createUpload);

router
  .route("/:id")
  .all(authorize.verifyAccessToken)
  .delete(uploadCampaignController.deleteUpload);

module.exports = router;
