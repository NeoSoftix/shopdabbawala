import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetPasswordToken :{
      type:String
    },

    resetPasswordExpire : {
      type:Date
    },

    role: {
      type: String,
      enum: ["admin", "vendor", "user"],
      default: "user",
    },

    addresses: {
      type: [
        {
          street: { type: String, trim: true, required: true },
          city: { type: String, trim: true, required: true },
          state: { type: String, trim: true, required: true },
          pincode: { type: String, trim: true, required: true },
          addressType: {
            type: String,
            enum: ["Home", "Work", "Other"],
            default: "Home",
          },
          isDefault: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
