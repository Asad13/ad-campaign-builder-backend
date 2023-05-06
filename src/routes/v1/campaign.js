/** @type {object} - Handles all the routes for User and Authentication */
const router = require("express").Router();
const { body } = require("express-validator");
const authorize = require("../../middlewares/v1/authorize");
const campaignController = require("../../controllers/v1/campaignController");

router
  .route("/")
  .all(authorize.verifyAccessToken)
  .get(campaignController.getAllCampaigns)
  .post(campaignController.createCampaign);

router
  .route("/:id")
  .all(authorize.verifyAccessToken)
  .get(campaignController.getCampaign)
  .put(campaignController.updateCampaign)
  .delete(campaignController.deleteCampaign);

module.exports = router;
