import { ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button";

// Proceed / Go Back footer for the checkout flow's customization step.
export default function ProceedActions({ loading, onGoBack }) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      <Button type="submit" size="lg" loading={loading} className="font-black tracking-widest uppercase">
        {loading ? "Please wait..." : "Proceed"}
      </Button>
      <button
        type="button"
        onClick={onGoBack}
        className="w-full flex items-center justify-center gap-1.5 text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors pt-2.5"
      >
        <ArrowLeft size={13} /> Go Back
      </button>
    </div>
  );
}
