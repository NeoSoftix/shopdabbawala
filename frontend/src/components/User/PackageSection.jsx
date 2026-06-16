import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiClock,
} from "react-icons/fi";

export default function PackageSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/packages"
      );

      const data = await response.json();

      if (data.success) {
        setPackages(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading Packages...
      </div>
    );
  }

  return (
    <section className="max-w-[1150px] mx-auto">

      {/* Header */}
      <div className="mb-10 text-center">

        <span className="inline-block px-4 py-2 rounded-full bg-red-50 text-[#E23747] font-semibold text-sm">
          🍱 Meal Packages
        </span>

        <h2 className="mt-4 text-4xl font-black text-gray-900">
          Choose Your Perfect Plan
        </h2>

        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          Fresh homemade meals prepared daily and delivered
          directly to your doorstep.
        </p>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

        {packages.map((pkg, index) => (

          <div
            key={pkg._id}
            className={`
              group
              bg-white
              rounded-[24px]
              border
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              ${
                index === 1
                  ? "border-[#E23747] shadow-[0_12px_30px_rgba(226,55,71,0.12)]"
                  : "border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
              }
            `}
          >

            {/* Top */}
            <div className="flex items-start justify-between">

              <div>

                <span
                  className={`
                    inline-flex
                    px-3
                    py-1
                    rounded-full
                    text-[11px]
                    font-semibold
                    ${
                      pkg.isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                >
                  {pkg.isActive
                    ? "Active Package"
                    : "Inactive Package"}
                </span>

                <h3 className="mt-3 text-xl font-black text-gray-900 capitalize">
                  {pkg.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {pkg.description}
                </p>

              </div>

            </div>

            {/* Price */}
            <div className="mt-5">

              <h2 className="text-3xl font-black text-[#E23747]">
                ₹{pkg.price}
              </h2>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">

              <div className="bg-red-50 rounded-2xl p-3">

                <p className="text-xs text-gray-500">
                  Total Meals
                </p>

                <h4 className="text-lg font-bold text-gray-900">
                  {pkg.totalMeals}
                </h4>

              </div>

              <div className="bg-red-50 rounded-2xl p-3">

                <p className="text-xs text-gray-500">
                  Validity
                </p>

                <h4 className="text-lg font-bold text-gray-900">
                  {pkg.validityDays} Days
                </h4>

              </div>

            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-5">

              <span className="px-3 py-1 rounded-full bg-red-50 text-[#E23747] text-[11px]">
                🍳 Breakfast
              </span>

              <span className="px-3 py-1 rounded-full bg-red-50 text-[#E23747] text-[11px]">
                🍛 Lunch
              </span>

              <span className="px-3 py-1 rounded-full bg-red-50 text-[#E23747] text-[11px]">
                🍽 Dinner
              </span>

              {pkg.isAddOnAllowed && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[11px]">
                  ➕ Add-On
                </span>
              )}

            </div>

            {/* Bottom */}
            <div className="mt-5 flex items-center justify-between">

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiClock />
                {pkg.validityDays} Days Plan
              </div>

              <button
                className="
                  h-10
                  px-4
                  rounded-xl
                  bg-gradient-to-r
                  from-[#E23747]
                  to-[#ff5d6c]
                  text-white
                  text-sm
                  font-semibold
                  flex
                  items-center
                  gap-2
                "
              >
                Select
                <FiArrowRight size={14} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}