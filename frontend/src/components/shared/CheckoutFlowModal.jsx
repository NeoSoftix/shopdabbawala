import { AnimatePresence } from "framer-motion";
import ModalShell from "./CheckoutFlowModal/ModalShell";
import StepIndicator from "./CheckoutFlowModal/StepIndicator";
import PincodeStep from "./CheckoutFlowModal/PincodeStep";
import CustomizeStep from "./CheckoutFlowModal/CustomizeStep";
import PhoneStep from "./CheckoutFlowModal/PhoneStep";
import OtpStep from "./CheckoutFlowModal/OtpStep";
import DetailsStep from "./CheckoutFlowModal/DetailsStep";
import ThankYouStep from "./CheckoutFlowModal/ThankYouStep";
import useCheckoutFlow from "./CheckoutFlowModal/useCheckoutFlow";

/**
 * Shared Checkout Flow Modal
 * mode="packages" → Pincode → Phone → OTP → Payment (Redirect)
 *                   → (Returns with ?payment_success) → Details → Thank You
 *
 * mode="create"   → Pincode → Customization(Children) → Phone → OTP → Payment (Redirect)
 *                   → (Returns with ?payment_success) → Details → Thank You
 */
export default function CheckoutFlowModal({
  isOpen,
  onClose,
  mode = "packages",
  planId,
  subscriptionData,
  isCustomizationValid = true,
  customizationErrorMsg = "Please complete your plan configuration.",
  onCustomizationSubmit,
  children,
}) {
  const {
    step,
    setStep,
    pincode,
    setPincode,
    phone,
    otp,
    setOtp,
    formData,
    setFormData,
    error,
    setError,
    loading,
    sessionId,
    stepLabels,
    currentStepIndex,
    handleClose,
    handlePincodeSubmit,
    handleCustomizationNext,
    handlePhoneChange,
    handlePhoneSubmit,
    handleResendOtp,
    handleOtpSubmit,
    handleDetailsSubmit,
  } = useCheckoutFlow({
    isOpen,
    onClose,
    mode,
    planId,
    subscriptionData,
    isCustomizationValid,
    customizationErrorMsg,
    onCustomizationSubmit,
  });

  const finalStep = mode === "packages" ? 5 : 6;
  const goBack = () => {
    setError("");
    setStep(step - 1);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      wide={mode === "create" && step === 2}
      showCloseButton={step !== finalStep}
    >
      {step < finalStep && (
        <StepIndicator stepLabels={stepLabels} currentStepIndex={currentStepIndex} />
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <PincodeStep
            pincode={pincode}
            setPincode={setPincode}
            error={error}
            loading={loading}
            onSubmit={handlePincodeSubmit}
          />
        )}

        {mode === "create" && step === 2 && (
          <CustomizeStep onSubmit={handleCustomizationNext} goBack={goBack} loading={loading} error={error}>
            {children}
          </CustomizeStep>
        )}

        {((mode === "packages" && step === 2) || (mode === "create" && step === 3)) && (
          <PhoneStep
            phone={phone}
            onPhoneChange={handlePhoneChange}
            error={error}
            loading={loading}
            onSubmit={handlePhoneSubmit}
            onBack={goBack}
          />
        )}

        {((mode === "packages" && step === 3) || (mode === "create" && step === 4)) && (
          <OtpStep
            phone={phone}
            otp={otp}
            setOtp={setOtp}
            error={error}
            loading={loading}
            onSubmit={handleOtpSubmit}
            onBack={() => {
              setOtp("");
              goBack();
            }}
            onResend={handleResendOtp}
          />
        )}

        {((mode === "packages" && step === 4) || (mode === "create" && step === 5)) && (
          <DetailsStep
            formData={formData}
            setFormData={setFormData}
            sessionId={sessionId}
            error={error}
            loading={loading}
            onSubmit={handleDetailsSubmit}
          />
        )}

        {((mode === "packages" && step === 5) || (mode === "create" && step === 6)) && (
          <ThankYouStep formData={formData} onClose={handleClose} />
        )}
      </AnimatePresence>
    </ModalShell>
  );
}
