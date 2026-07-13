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

    // Fixed plan this vendor serves — a vendor is onboarded for exactly one
    // package. Left unset when isCustomPackageVendor is true (mutually
    // exclusive with it — enforced in the controller).
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },

    // When true, this vendor exclusively serves "Build Your Own Package"
    // (custom plan) orders instead of a fixed Package. Mutually exclusive
    // with `package` — enforced in the controller.
    isCustomPackageVendor: {
      type: Boolean,
      default: false,
    },

    // Pincodes where this vendor delivers its package (or, for a custom
    // package vendor, its custom-plan orders). A (pincode, package)
    // combination — or (pincode, custom) — may only belong to one vendor,
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
    
    serviceZones: [
      {
        area: {
          type: String,
          required: true,
          trim: true,
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
