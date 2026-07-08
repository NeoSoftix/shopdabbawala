import mongoose from "mongoose";
import Package from "../../models/package.model.js";
import stripe from "../../config/stripe.js";

// toggle status of package
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid package data", success: false });
    }

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({ message: "Package Not Found", success: false });
    }

    const newStatus = !packageData.isActive;

    // ---------------- STRIPE SYNC ----------------
    if (packageData.stripeProductId) {
      try {
        await stripe.products.update(packageData.stripeProductId, { active: newStatus });
      } catch (productErr) {
        console.error("Stripe Product Toggle Error:", productErr.message);
        return res.status(500).json({ message: "Failed to update package status on Stripe", success: false });
      }
    }

    if (packageData.stripePriceId) {
      try {
        if (!newStatus) {
          // Deactivating: pehle default_price hatao, tabhi price archive hone dega Stripe
          await stripe.products.update(packageData.stripeProductId, { default_price: "" });
          await stripe.prices.update(packageData.stripePriceId, { active: false });
        } else {
          // Reactivating: price ko active karo aur wapas default bana do
          await stripe.prices.update(packageData.stripePriceId, { active: true });
          await stripe.products.update(packageData.stripeProductId, {
            default_price: packageData.stripePriceId,
          });
        }
      } catch (priceErr) {
        console.error("Stripe Price Toggle Error:", priceErr.message);

        try {
          await stripe.products.update(packageData.stripeProductId, { active: !newStatus });
        } catch (rollbackErr) {
          console.error("Stripe Product Rollback Error:", rollbackErr.message);
        }

        return res.status(500).json({ message: "Failed to update package price status on Stripe", success: false });
      }
    }

    // ---------------- DB UPDATE ----------------
    packageData.isActive = newStatus;
    await packageData.save();

    return res.status(200).json({
      message: `Package ${packageData.isActive ? "activated" : "deactivated"} successfully`,
      data: packageData,
      success: true,
    });
  } catch (error) {
    console.log("Toggle status of Package error", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// delete the package
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid package ID",
        success: false,
      });
    }

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({
        message: "Package Not found",
        success: false,
      });
    }

    // ---------------- STRIPE CLEANUP ----------------
    // Sirf product ko archive karo. Price ko chhedne ki zaroorat nahi —
    // product inactive hote hi naye purchases automatically band ho jate hain.
    if (packageData.stripeProductId) {
      try {
        await stripe.products.update(packageData.stripeProductId, {
          active: false,
        });
      } catch (productErr) {
        console.error("Stripe Product Archive Error:", productErr.message);

        return res.status(500).json({
          message: "Failed to archive package on Stripe",
          success: false,
        });
      }
    }

    // ---------------- DB DELETE ----------------
    await packageData.deleteOne();

    return res.status(200).json({
      message: "Package Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Delete the package error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
