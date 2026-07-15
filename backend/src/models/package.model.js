import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name of Package is Required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price of Package is Required"],
      min: 0,
    },

    discountedPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    totalMeals: {
      type: Number,
      required: [true, "Number of total tiffins is Required"],
      min: 1,
    },

    validityDays: {
      type: Number,
      required: [true, "Validity of this package is Required"],
      min: 1,
    },

    isAddOnAllowed: {
      type: Boolean,
      default: true,
    },

    features: {
      type: [String],
      required: [true, "Features are required"],
      validate: [
        {
          validator: (arr) => arr.length >= 1,
          message: "At least one feature is required",
        },
        {
          validator: (arr) => arr.length <= 10,
          message: "Maximum 10 features are allowed",
        },
      ],
    },

    stripeProductId: {
  type: String,
},

stripePriceId: {
  type: String,
},

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
