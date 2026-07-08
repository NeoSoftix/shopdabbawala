const DurationPlansHeader = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
          Duration Plans
        </h1>
        <p className="text-gray-500 text-xs mt-0.5">
          Set how long a plan runs, how many meals it includes, and the price per meal.
          These show up as duration options on the customer's checkout page.
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-1.5 bg-[#dc2626] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl shadow-sm shadow-red-600/20 transition-all active:scale-[0.98] focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Duration Plan
      </button>
    </div>
  );
};

export default DurationPlansHeader;
