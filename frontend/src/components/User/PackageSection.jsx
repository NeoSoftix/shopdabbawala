import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

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
    <section className="max-w-[1200px] mx-auto py-16 px-4">

      {/* Header */}
      <div className="text-center mb-14">

        <span className="inline-block px-4 py-2 rounded-full bg-red-50 text-[#E23747] font-semibold text-sm">
          🍱 Meal Packages
        </span>

        <h2 className="mt-4 text-4xl lg:text-5xl font-black text-gray-900">
          Choose Your Perfect Plan
        </h2>

        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          Fresh homemade meals prepared daily and delivered
          directly to your doorstep.
        </p>

      </div>

      {/* Packages */}
      <div className="grid lg:grid-cols-3 gap-8">

        {packages.slice(0, 3).map((pkg, index) => (

          <div
            key={pkg._id}
            className={`
              relative
              bg-white
              rounded-[28px]
              border-2
              p-8
              text-center
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
              ${
                index === 1
                  ? "border-[#E23747] scale-[1.03] shadow-[0_20px_50px_rgba(226,55,71,0.15)]"
                  : "border-red-100"
              }
            `}
          >

            {/* Popular Badge */}
            {index === 1 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#E23747] text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg">
                  ⭐ Popular
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center text-4xl">
              🍱
            </div>

            {/* Package Name */}
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              {pkg.name}
            </h3>

            {/* Price */}
            <div className="mt-5">

              <h2 className="text-5xl font-black text-[#E23747]">
                ₹{pkg.price}
              </h2>

              <p className="mt-2 text-gray-500 text-sm">
                Per Package
              </p>

            </div>

            {/* Features */}
            <div className="mt-8 space-y-4 text-left">

              <div className="flex items-center gap-3 text-gray-700">
                ✅ {pkg.totalMeals} Meals Included
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                ✅ {pkg.validityDays} Days Validity
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                ✅ Breakfast / Lunch / Dinner
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                ✅ Free Home Delivery
              </div>

              {pkg.isAddOnAllowed && (
                <div className="flex items-center gap-3 text-gray-700">
                  ✅ Add-On Available
                </div>
              )}

            </div>

            {/* CTA */}
            <button
              className="
                mt-8
                w-full
                h-12
                rounded-xl
                bg-[#E23747]
                hover:bg-[#cf3040]
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >
              Choose Plan
              <FiArrowRight />
            </button>

          </div>

        ))}

      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">

        <button
          className="
            bg-[#E23747]
            hover:bg-[#cf3040]
            text-white
            px-8
            h-12
            rounded-xl
            font-semibold
            transition
          "
        >
          Build Your Own Package 🍱
        </button>

      </div>

    </section>
  );
}