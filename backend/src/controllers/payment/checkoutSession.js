import jwt from "jsonwebtoken"
import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"
import User from "../../models/User.model.js"

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

// The web checkout flow requires the buyer to already be logged in (they
// start checkout from an authenticated page), so their browser already has
// the "token" cookie by the time Stripe redirects them back. Purchases that
// were never initiated from a logged-in browser (e.g. a Stripe Checkout link
// texted via the WhatsApp bot) have no such cookie, so every verifyToken
// route on this page (getCheckoutSession, saveCheckoutDetails) would fail
// with "Token not found" - even though the payment itself succeeded.
//
// This route logs the buyer in using nothing but the Stripe session id
// that's already sitting in the payment-success URL (set server-side at
// checkout time, so it can't be spoofed) - the same trust level this app
// already gives a password-reset token. It's intentionally unauthenticated;
// it must be, since its whole job is to establish a session where none
// exists yet.
export const checkoutLogin = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const payment = await Payment.findOne({ stripeSessionId: sessionId }).select("user");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const user = await User.findById(payment.user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: req.secure,
      sameSite: req.secure ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Checkout Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
