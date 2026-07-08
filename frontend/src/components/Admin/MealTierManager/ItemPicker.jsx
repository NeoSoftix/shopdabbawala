// Collapsible checklist for choosing which items belong to a tier —
// selected-item chips (with quick-remove), a search box and the checklist itself.
export default function ItemPicker({
  allItems,
  filteredItems,
  itemNameById,
  itemsLoading,
  itemSearch,
  onSearchChange,
  isOpen,
  onToggleOpen,
  selectedIds,
  onToggleItem,
  onRemoveItem,
  error,
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-700 mb-1 block">
        Items
      </label>

      {/* Selected items summary — chips with quick-remove, always visible */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2 bg-red-50/50 border border-red-100 rounded-xl p-2">
          {selectedIds.map((itemId) => (
            <span
              key={itemId}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#dc2626] bg-white border border-red-200 rounded-lg pl-2 pr-1 py-0.5"
            >
              {itemNameById[itemId] || "…"}
              <button
                type="button"
                onClick={() => onRemoveItem(itemId)}
                className="w-3.5 h-3.5 flex items-center justify-center text-red-300 hover:text-red-600 rounded-full transition-all focus:outline-none"
                aria-label="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Toggle button — checklist stays collapsed until admin clicks to open it */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between border border-gray-300 rounded-xl p-2.5 text-xs font-semibold text-gray-700 hover:border-[#dc2626] transition-all focus:outline-none"
      >
        <span>
          {selectedIds.length > 0
            ? `${selectedIds.length} item${selectedIds.length === 1 ? "" : "s"} selected`
            : "Select items"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-1.5">
          {/* Search box — filters the checklist below, useful once the catalog grows */}
          <div className="relative mb-1.5">
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items..."
              autoFocus
              className="w-full border border-gray-300 rounded-xl p-2 pl-8 text-xs text-gray-800 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

          <div className="border border-gray-200 rounded-xl p-2.5 max-h-56 overflow-y-auto bg-[#f9f9fb]">
            {itemsLoading && (
              <p className="text-xs text-gray-400 py-2 text-center">Loading items...</p>
            )}
            {!itemsLoading && allItems.length === 0 && (
              <p className="text-xs text-gray-400 py-2 text-center">No active items found</p>
            )}
            {!itemsLoading && allItems.length > 0 && filteredItems.length === 0 && (
              <p className="text-xs text-gray-400 py-2 text-center">No items match "{itemSearch}"</p>
            )}
            {!itemsLoading &&
              filteredItems.map((item) => (
                <label
                  key={item._id}
                  className="flex items-center gap-2 py-1.5 px-1 rounded-lg hover:bg-white cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => onToggleItem(item._id)}
                    className="w-3.5 h-3.5 accent-[#dc2626] rounded"
                  />
                  <span className="text-xs text-gray-700">{item.name}</span>
                </label>
              ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
