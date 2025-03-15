const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Service to create  checkout session.
 * @param {string} email
 * @param {string} priceId
 */

const createCheckoutSession = async (userId, email, priceId, autoRenewal,subscriptionPlan) => {
  try {
    //check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    //check if the user is already subscribed
    if (user.subscriptionId && user.subscriptionStatus === "active") {
      throw new CustomError("User is already subscribed and active", 400);
    }

    //check if the user is stripe customer
    if (!user.stripeCustomerId) {
      const customer = await createStripeCustomer(email);
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    //create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: user.stripeCustomerId,
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${subscriptionPlan}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: { userId, autoRenewal,subscriptionPlan }, //store autoRenewal preference
    });

    return session.url;
  } catch (error) {
    throw new CustomError(
      error.message || "Error creating checkout session",
      error.statusCode || 500
    );
  }
};

/**
 * Create a new Stripe Customer
 * @param {string} email
 */

const createStripeCustomer = async (email) => {
  try {
    const customer = await stripe.customers.create({
      email,
    });
    return customer;
  } catch (error) {
    throw new CustomError(
      error.message || "Error creating Stripe customer",
      error.statusCode || 500
    );
  }
};

/**
 * Verify payment
 * @param {string} sessionId
 */
const verifyPayment = async (sessionId) => {
  try {
    //retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      return { message: "Payment verified" };
    } else {
      throw new CustomError("Payment not completed", 400);
    }
  } catch (error) {
    throw new CustomError(
      error.message || "Error verifying payment",
      error.statusCode || 500
    );
  }
};

//webhooks handler for stripe events

/**
 * serive to handle stripe events
 */
const stripeWebhookHandler = async (event) => {
  try {
    const session = event.data.object;

    switch (event.type) {
      /**
       * ✅ Handle Checkout Session Completed (New Subscription)
       */
      case "checkout.session.completed":
        const userId = session.metadata.userId;
        const autoRenewal = session.metadata.autoRenewal === "true"; // Convert to boolean
        const subscriptionId = session.subscription; // Get Subscription ID
        const subscriptionPlan = session.metadata.subscriptionPlan;
        if (!subscriptionId) {
          console.error("❌ No Subscription ID found in event.");
          return;
        }

        // ✅ If AutoRenewal is false, schedule cancellation at period end
        if (!autoRenewal) {
          await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true, // Disables auto-renewal
          });

          await User.findByIdAndUpdate(userId, {
            subscriptionId,
            subscriptionPlan,
            subscriptionStatus: "active",
            autoRenewal: false,
          });

          console.log(`✅ Auto-renewal disabled for user: ${userId}`);
        } else {
          // ✅ Update user with subscription details
          await User.findByIdAndUpdate(userId, {
            subscriptionId,
            subscriptionPlan,
            subscriptionStatus: "active",
            autoRenewal: true,
          });
        }
        console.log(
          `✅ Subscription created for user: ${userId}, AutoRenewal: ${autoRenewal}`
        );
        break;

      /**
       * ✅ Handle Payment Succeeded (Subscription Renewed)
       */
      case "invoice.payment_succeeded":
        const renewedSubscriptionId = session.subscription;

        if (!renewedSubscriptionId) {
          console.error("❌ No Subscription ID found in invoice event.");
          return;
        }

        await User.findOneAndUpdate(
          { subscriptionId: renewedSubscriptionId },
          { subscriptionStatus: "active" }
        );

        console.log("✅ Subscription renewed successfully.");
        break;

      /**
       * ✅ Handle Subscription Deleted (Expired or Canceled)
       */
      case "customer.subscription.deleted":
        const expiredSubscriptionId = session.id;

        await User.findOneAndUpdate(
          { subscriptionId: expiredSubscriptionId },
          { subscriptionStatus: "expired",
            subscriptionPlan:null
           }
        );

        console.log("❌ Subscription expired or canceled.");
        break;

      /**
       * ✅ Handle Payment Failure (Subscription Renewal Failed)
       */
      case "invoice.payment_failed":
        const failedSubscriptionId = session.subscription;

        if (!failedSubscriptionId) {
          console.error("❌ No Subscription ID found in failed payment event.");
          return;
        }

        await User.findOneAndUpdate(
          { subscriptionId: failedSubscriptionId },
          { subscriptionStatus: "payment_failed" }
        );

        console.log("⚠️ Subscription payment failed.");
        break;

      default:
        console.log(`🔹 Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("❌ Error handling Stripe webhook event:", error.message);
    throw new CustomError(
      error.message || "Error handling Stripe webhook event",
      error.statusCode || 500
    );
  }
};

/**
 * Cancel subscription
 * @param {string} email
 */
const cancelSubscription = async (userId, email) => {
  try {
    // check if user exist and have subscription
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (!user.subscriptionId) {
      throw new CustomError("User does not have any subscription", 400);
    }

    //cancel subscription
    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true, //cancel at the end of the current period
    });

     // ✅ Update the database
     await User.findByIdAndUpdate(userId, {
        subscriptionStatus: "active",
        autoRenewal: false, // ✅ Disable auto-renewal
      });

    return {
      message:
        "Subscription cancelled.Your subscription will end at the billing period.",
    };
  } catch (error) {
    throw new CustomError(
      error.message || "Error canceling subscription",
      error.statusCode || 500
    );
  }
};

module.exports = { createCheckoutSession, verifyPayment, stripeWebhookHandler, cancelSubscription,createStripeCustomer };
