import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      url:{
        type:String,
        default:""
      },
      publicId:{
        type:String,
        default:""
      },
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // mealType: {
    //   type: mongoose,
    //   ref:"Meal",
    //   required: true,
    // },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);