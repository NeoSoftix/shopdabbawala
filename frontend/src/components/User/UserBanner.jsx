import { FiCalendar, FiPackage } from "react-icons/fi";

export default function UserBanner() {
  return (
    <div className="bg-gradient-to-r from-[#E23747] to-[#ff5c6c] rounded-2xl p-6 text-white">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-red-100">
            Fresh meals are waiting for you.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 px-5 py-4 rounded-xl">
            <div className="flex items-center gap-2">
              <FiPackage />
              <span>Meals Left</span>
            </div>

            <h3 className="text-2xl font-bold mt-2">
              18
            </h3>
          </div>

          <div className="bg-white/10 px-5 py-4 rounded-xl">
            <div className="flex items-center gap-2">
              <FiCalendar />
              <span>Next Meal</span>
            </div>

            <h3 className="text-lg font-bold mt-2">
              Tomorrow
            </h3>
          </div>
        </div>

        <button className="bg-white text-[#E23747] px-5 py-3 rounded-xl font-semibold">
          Schedule Meal
        </button>
      </div>
    </div>
  );
}