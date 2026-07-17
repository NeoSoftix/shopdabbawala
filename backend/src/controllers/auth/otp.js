import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";
import client from "../../config/twilio.js";
import OTP from "../../models/otp.model.js";
import Subscription from "../../models/Subcription.model.js";

// Helper to format/normalize phone number for Twilio Verify (E.164 format)
const formatPhoneNumber = (phone, countryCode) => {
  if (!phone) return "";

  let cleaned = phone.trim();

  // Remove spaces, dashes, parentheses
  cleaned = cleaned.replace(/[\s\-\(\)]/g, "");

  // If it already starts with '+', keep it
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // Remove leading zero(s)
  cleaned = cleaned.replace(/^0+/, "");

  // Use country code from frontend
  return `${countryCode}${cleaned}`;
};


// send otp controller
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    const formattedPhone = formatPhoneNumber(phone);

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms',
      });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (err) {
    console.log('Send OTP Error:', err);

    return res.status(500).json({
      success: false,
      message: err.status === 404
        ? 'Verification service not found. Please verify your Twilio settings.'
        : err.message,
    });
  }
};

// verify otp controller
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp, allowNoSubscription } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    const formattedPhone = formatPhoneNumber(phone);

    let verificationCheck;
    try {
      verificationCheck = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: formattedPhone,
          code: otp,
        });
    } catch (twilioErr) {
      console.log('Twilio Verify OTP Error:', twilioErr);
      if (twilioErr.status === 404) {
        return res.status(400).json({
          success: false,
          message: 'OTP has expired or was already verified. Please request a new OTP.',
        });
      }
      throw twilioErr;
    }

    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    const normalizePhone = (p) => {
      if (!p) return "";
      let cleaned = p.replace(/\D/g, "");
      if (cleaned.length === 12 && cleaned.startsWith("91")) {
        cleaned = cleaned.slice(2);
      }
      return cleaned;
    };

    const normPhone = normalizePhone(phone);
    const possibleNumbers = [normPhone, `+91${normPhone}`, `91${normPhone}`];

    let user = await User.findOne({ phone: { $in: possibleNumbers } });

    // Removed allowNoSubscription logic to allow all users to login.

    if (!user) {
      user = await User.create({
        phone: normPhone,
      });
    } else {
      if (user.phone !== normPhone) {
        try {
          user.phone = normPhone;
          await user.save();
        } catch (saveErr) {
          console.warn("Could not normalize phone number due to duplicate key constraint, keeping original:", saveErr.message);
        }
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user,
    });

  } catch (err) {
    console.log('Verify OTP Error:', err);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
