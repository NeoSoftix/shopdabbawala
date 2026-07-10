import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa6";

// Shared "no active plan yet" gate shown on the Plan Summary tab and the
// Build Custom Meal tab until the user actually owns a subscription.
const NoActivePlan = ({
  title = "Plan Required",
  description = "You haven't purchased a meal plan yet. Buy a plan first to unlock meal scheduling and create your custom meal schedule.",
  noteText = "Meal scheduling and customization are locked until you activate a plan.",
  buttonText = "Browse Plans",
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-br from-[#FFF5F5] to-white rounded-[32px] border border-red-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8 md:p-12">
        {/* Left: message + CTA */}
        <div className="text-center md:text-left">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl mx-auto md:mx-0 mb-5">
            <FaLock />
          </div>

          <h2 className="text-3xl font-black text-[#1B254B] tracking-tight mb-3">
            {title}
          </h2>

          <p className="text-[#8f96b3] text-sm sm:text-base leading-relaxed max-w-md mx-auto md:mx-0">
            {description}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-lg shadow-red-100"
          >
            {buttonText} <span>→</span>
          </button>

          <div className="mt-6 flex items-start gap-3 bg-red-50/80 text-red-600 text-xs sm:text-sm font-semibold rounded-2xl px-4 py-3 max-w-md mx-auto md:mx-0">
            <FaLock className="mt-0.5 shrink-0" size={13} />
            <span>{noteText}</span>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="flex items-center justify-center">
          <img
            src="/noactiveplan.png"
            alt="No active meal plan"
            className="w-full max-w-sm object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default NoActivePlan;
