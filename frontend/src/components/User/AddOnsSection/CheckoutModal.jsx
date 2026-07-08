import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

import OrderPreviewStep from "./OrderPreviewStep";
import PincodeStep from "./PincodeStep";
import PhoneStep from "./PhoneStep";
import OtpStep from "./OtpStep";
import RedirectingStep from "./RedirectingStep";

export default function CheckoutModal({
  isOpen,
  step,
  onClose,
  cart,
  addonsData,
  totalCartAmount,
  onConfirmPreview,
  pincode,
  onPincodeChange,
  pincodeError,
  pincodeLoading,
  onPincodeSubmit,
  phone,
  onPhoneChange,
  detailsError,
  detailsLoading,
  onPhoneSubmit,
  otp,
  onOtpChange,
  otpError,
  otpLoading,
  onOtpVerify,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Layout wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto font-sans"
          >
            {/* Close Button element (FaTimes used here) */}
            {step !== 5 && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
              >
                <FaTimes size={18} />
              </button>
            )}

            {/* STEP 1: PREVIEW */}
            {step === 1 && (
              <OrderPreviewStep
                cart={cart}
                addonsData={addonsData}
                totalCartAmount={totalCartAmount}
                onConfirm={onConfirmPreview}
              />
            )}

            {/* STEP 2: PINCODE SEARCH ENGINE */}
            {step === 2 && (
              <PincodeStep
                pincode={pincode}
                onPincodeChange={onPincodeChange}
                pincodeError={pincodeError}
                pincodeLoading={pincodeLoading}
                onSubmit={onPincodeSubmit}
              />
            )}

            {/* STEP 3: PHONE NUMBER */}
            {step === 3 && (
              <PhoneStep
                pincode={pincode}
                phone={phone}
                onPhoneChange={onPhoneChange}
                detailsError={detailsError}
                detailsLoading={detailsLoading}
                onSubmit={onPhoneSubmit}
              />
            )}

            {/* STEP 4: SECURE OTP MODULE */}
            {step === 4 && (
              <OtpStep
                phone={phone}
                otp={otp}
                onOtpChange={onOtpChange}
                otpError={otpError}
                otpLoading={otpLoading}
                onSubmit={onOtpVerify}
              />
            )}

            {/* STEP 5: REDIRECTING TO STRIPE */}
            {step === 5 && <RedirectingStep />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
