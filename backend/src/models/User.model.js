import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
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
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
