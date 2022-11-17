const express=require("express");
const { processPayment, sendStripeKey } = require("../controller/paymentController");
const router=express.Router();

const { isAuthenticatedUser,authorizeRole } = require("../middleware/Auth");

router.route("/payment/process").post(isAuthenticatedUser,processPayment)
router.route("/stripeapikey").get(isAuthenticatedUser,sendStripeKey)
module.exports=router;