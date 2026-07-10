import mongoose from "mongoose";

const vendorAssignmentSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

vendorAssignmentSchema.index({ pincode: 1, package: 1 }, { unique: true });

const VendorAssignment = mongoose.model("VendorAssignment", vendorAssignmentSchema);

export default VendorAssignment;
