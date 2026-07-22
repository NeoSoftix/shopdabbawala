import mongoose from "mongoose";

// Tracks where a phone number is in the WhatsApp bot's conversation flow.
// Twilio webhooks are stateless per-request, so this is what lets the bot
// remember "what did I just ask/show this number" between messages.
const whatsappSessionSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    state: {
      type: String,
      enum: ["AWAITING_PHONE", "AWAITING_MENU_CHOICE", "AWAITING_PLAN_CHOICE"],
      default: "AWAITING_PHONE",
    },

    // Snapshot of the catalog shown to this number (serial -> packageId),
    // so a reply like "2" always resolves to the exact package that was
    // displayed, even if the live package list changes mid-conversation.
    catalog: [
      {
        serial: Number,
        packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Abandoned conversations expire 30 minutes after the last message, so a
// stale "waiting for plan choice" state doesn't linger forever.
whatsappSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 1800 });

const WhatsAppSession = mongoose.model("WhatsAppSession", whatsappSessionSchema);
export default WhatsAppSession;
