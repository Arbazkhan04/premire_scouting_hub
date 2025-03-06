const {
    createCheckoutSession,
    verifyPayment,
    stripeWebhookHandler,
    cancelSubscription,
  } = require("./stripe.service");
  const CustomError = require("../utils/customError");
  const responseHandler = require("../utils/responseHandler");
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  
  /**
   * Controller to create a checkout session for a subscription.
   */
  const createCheckout = async (req, res, next) => {
    try {
      const userId = req.user.userId; // Extracted from auth middleware
      const { email, priceId, autoRenewal } = req.body;
  
      if (!email || !priceId) {
        return responseHandler(
          res,
          400,
          "Email and PriceId are required",
          null
        );
      }
  
      const sessionUrl = await createCheckoutSession(userId, email, priceId, autoRenewal);
      return responseHandler(res, 200, "Checkout session created", { sessionUrl });
    } catch (error) {
      next(
        error instanceof CustomError ? error : new CustomError(error.message, 500)
      );
    }
  };
  
  /**
   * Controller to verify a payment using session ID.
   */
  const verifyPaymentController = async (req, res, next) => {
    try {
      const { sessionId } = req.query;
  
      if (!sessionId) {
        return responseHandler(res, 400, "SessionId is required", null);
      }
  
      const result = await verifyPayment(sessionId);
      return responseHandler(res, 200, result.message, null);
    } catch (error) {
      next(
        error instanceof CustomError ? error : new CustomError(error.message, 500)
      );
    }
  };
  
  /**
   * Controller to handle Stripe webhook events.
   */
  const stripeWebhook = async (req, res, next) => {
    try {
      const sig= req.headers["stripe-signature"];
      let event;
      console.log("Stripe webhook event: ", req.body);

    //   // ✅ Convert raw body to string for Stripe verification
    //   const rawBody = req.body.toString();

      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
      console.log("Stripe webhook event: ", event);
      await stripeWebhookHandler(event);
  
      return res.status(200).json({ received: true });
    } catch (error) {
      next(
        error instanceof CustomError ? error : new CustomError(error.message, 500)
      );
    }
  };
  
  /**
   * Controller to cancel a user's subscription.
   */
  const cancelUserSubscription = async (req, res, next) => {
    try {
      const userId = req.user.userId; // Extracted from auth middleware
      const { email } = req.body;
  
      if (!email) {
        return responseHandler(res, 400, "Email is required", null);
      }
  
      const result = await cancelSubscription(userId, email);
      return responseHandler(res, 200, result.message, null);
    } catch (error) {
      next(
        error instanceof CustomError ? error : new CustomError(error.message, 500)
      );
    }
  };
  
  module.exports = {
    createCheckout,
    verifyPaymentController,
    stripeWebhook,
    cancelUserSubscription,
  };
  