import { useEffect } from "react";
import { getDeliveryChargeByPincode } from "../../../services/deliveryCharge.service";

// Renders nothing - just watches the verified pincode + delivery method and
// looks up the admin-configured per-pincode delivery charge, reporting the
// result back to CreatePackage via onResult. Pulled out into its own
// component (rather than a useEffect inline in CreatePackage's render-prop
// children) because that render-prop function is actually invoked by
// CustomizeStep during ITS render, not CreatePackage's - hooks called there
// would attach to the wrong fiber.
export default function DeliveryChargeSync({ pincode, deliveryMethod, onResult }) {
  useEffect(() => {
    if (deliveryMethod !== "Delivery" || !pincode) {
      onResult({ charge: 0, loading: false, error: "" });
      return;
    }

    let cancelled = false;
    onResult({ charge: 0, loading: true, error: "" });

    getDeliveryChargeByPincode(pincode)
      .then((res) => {
        if (cancelled) return;
        onResult({ charge: Number(res?.data?.charge) || 0, loading: false, error: "" });
      })
      .catch(() => {
        if (cancelled) return;
        onResult({
          charge: 0,
          loading: false,
          error: `No delivery charge configured for pincode ${pincode}. Please contact support or choose Pickup instead.`,
        });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode, deliveryMethod]);

  return null;
}
