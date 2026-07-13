import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"

// Route requires verifyToken (see payment.routes.js), so req.user is always
// set here - but that alone doesn't stop a logged-in user from passing
// someone else's sessionId and reading their name/email/address. Verify the
// session was actually created for the requesting user via our own Payment
// record (set server-side at checkout time, so it can't be spoofed) before
// trusting Stripe's session.metadata.userId.
export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const payment = await Payment.findOne({ stripeSessionId: sessionId }).select("user");

    if (!payment || String(payment.user) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      success: true,
      customer_details: session.customer_details,
    });
  } catch (error) {
    console.error("Get Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
