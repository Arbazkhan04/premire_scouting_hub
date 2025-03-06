const express = require("express");
const {
  createCheckout,
  verifyPaymentController,
  stripeWebhook,
  cancelUserSubscription,
} = require("./stripe.controller");
const {auth} = require("../middlewares/authentication");


const router = express.Router();

// **1️⃣ Create Checkout Session**
router.post("/create-checkout-session", auth, createCheckout);

// **2️⃣ Verify Payment**
router.get("/verify-payment",auth, verifyPaymentController);

// **3️⃣ Handle Stripe Webhooks (No authentication required)**
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// **4️⃣ Cancel Subscription**
router.post("/cancel-subscription", auth, cancelUserSubscription);

module.exports = router;
