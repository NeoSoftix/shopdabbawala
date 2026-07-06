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
    unique: true,
    sparse: true,
    default: undefined,
    trim:true
  },

    phone: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid international phone number']
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
