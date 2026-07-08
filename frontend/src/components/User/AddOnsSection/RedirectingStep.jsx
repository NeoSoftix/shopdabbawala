
import { SectionLoader } from "../../shared/Loader";

export default function RedirectingStep() {
  return (
    <div className="text-center py-2">
      <SectionLoader text="Redirecting to Payment" />
      <p className="text-sm font-semibold text-gray-500 max-w-xs mx-auto -mt-2">
        Please wait while we take you to our secure payment page...
      </p>
    </div>
  );
}
