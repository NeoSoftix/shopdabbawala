import { UtensilsCrossed } from "lucide-react";
import PillToggleGroup from "../../../components/shared/PillToggleGroup";
import DateCalendarPicker from "./DateCalendarPicker";

// Icon+label are bundled into a single `icon` element (with `label` left
// empty) so the exact colored icon/text grouping from the original markup
// is preserved — PillToggleGroup renders icon and label as separate
// siblings, which would otherwise lose the shared text-color wrapper.
const preferenceOptions = [
  {
    value: "Veg",
    label: "",
    icon: (
      <span className="flex items-center gap-2 text-green-700 font-medium">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="#16A34A" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="#16A34A" />
        </svg>
        <span>Veg</span>
      </span>
    ),
  },
  {
    value: "Non-Veg",
    label: "",
    icon: (
      <span className="flex items-center gap-2 text-red-700 font-medium">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="#DC2626" strokeWidth="2" />
          <path d="M12 7L16.5 15H7.5L12 7Z" fill="#DC2626" />
        </svg>
        <span>Non Veg</span>
      </span>
    ),
  },
];

export default function MealPreferenceAndDate({ preference, onPreferenceChange, startDate, onStartDateChange }) {
  return (
    <div className="bg-white p-2.5 px-3 rounded-2xl border border-gray-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
            <UtensilsCrossed size={13} /> Meal Preference
          </label>
          <PillToggleGroup options={preferenceOptions} value={preference} onChange={onPreferenceChange} />
        </div>

        <DateCalendarPicker value={startDate} onChange={onStartDateChange} />
      </div>
    </div>
  );
}
