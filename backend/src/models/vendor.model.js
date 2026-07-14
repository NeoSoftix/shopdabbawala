import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    // The single food category (e.g. "North Indian", "Chinese") this vendor
    // serves in its pincodes — a vendor may only serve one category per
    // pincode, enforced in the controller. This is the sole key used to
    // route a customer's order to a vendor (no package-based assignment).
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Pincodes where this vendor delivers orders for its category. A
    // (pincode, category) combination may only belong to one vendor,
    // enforced in the controller.
    servicePincodes: {
      type: [String],
      default: [],
      set: (arr) => (Array.isArray(arr) ? arr.map((p) => p.trim()) : arr),
    },

    logo: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
