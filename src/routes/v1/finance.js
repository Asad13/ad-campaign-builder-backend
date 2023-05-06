const router = require("express").Router();
const { body } = require("express-validator");
const financeController = require("../../controllers/v1/financeController");
const authorize = require("../../middlewares/v1/authorize");

router
  .route("/cards")
  .all(authorize.verifyAccessToken)
  .get(authorize.verifyAdmin, financeController.getAllCards)
  .post(
    authorize.verifyAdmin,
    body("name").not().isEmpty().trim().escape(),
    body("number").not().isEmpty().trim().escape(),
    body("exp_month").not().isEmpty().escape(),
    body("exp_year").not().isEmpty().escape(),
    body("cvc").not().isEmpty().escape(),
    body("address_line1").not().isEmpty().trim().escape(),
    body("address_city").not().isEmpty().trim().escape(),
    body("address_state").not().isEmpty().trim().escape(),
    body("address_zip").not().isEmpty().trim().escape(),
    body("address_country").not().isEmpty().trim().escape(),
    body("isDefault").not().isEmpty().escape(),
    financeController.addCard
  );

router
  .route("/cards/:id")
  .all(authorize.verifyAccessToken)
  .get(authorize.verifyAdmin, financeController.getCard)
  .put(
    authorize.verifyAdmin,
    body("name").not().isEmpty().trim().escape(),
    body("number").not().isEmpty().trim().escape(),
    body("exp_month").not().isEmpty().escape(),
    body("exp_year").not().isEmpty().escape(),
    body("cvc").not().isEmpty().escape(),
    body("address_line1").not().isEmpty().trim().escape(),
    body("address_city").not().isEmpty().trim().escape(),
    body("address_state").not().isEmpty().trim().escape(),
    body("address_zip").not().isEmpty().trim().escape(),
    body("address_country").not().isEmpty().trim().escape(),
    body("isDefault").not().isEmpty().escape(),
    financeController.updateCard
  )
  .delete(authorize.verifyAdmin, financeController.deleteCard);

router
  .route("/tax/info")
  .all(authorize.verifyAccessToken)
  .get(authorize.verifyAdmin, financeController.getTaxInfo)
  .post(
    authorize.verifyAdmin,
    body("name").not().isEmpty().trim().escape(),
    body("address_line_one").not().isEmpty().trim().escape(),
    body("address_line_two").not().isEmpty().escape(),
    financeController.saveTaxInfo
  );

router
  .route("/tax/vat-gst")
  .all(authorize.verifyAccessToken)
  .post(
    authorize.verifyAdmin,
    body("vat_gst").not().isEmpty().trim().escape(),
    financeController.saveVAT_GST
  );

router
  .route("/invoices")
  .all(authorize.verifyAccessToken)
  .get(authorize.verifyAdmin, financeController.getAllInvoices);

router
  .route("/invoices/:id")
  .all(authorize.verifyAccessToken)
  .get(authorize.verifyAdmin, financeController.getInvoice);

module.exports = router;
