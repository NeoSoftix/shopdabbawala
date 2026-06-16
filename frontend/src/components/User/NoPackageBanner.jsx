import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function NoPackageBanner() {
  return (

<section className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-[#E23747] via-[#f14658] to-[#ff5c6c] min-h-[400px]">

    {/* White Curve */}
<div className="absolute right-0 top-0 h-full w-[38%] bg-white rounded-l-[180px]" />
      {/* Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:12px_12px]" />
      </div>

<div className="relative z-10 grid lg:grid-cols-2 gap-6 items-center h-full px-8 lg:px-12 py-8">
        {/* LEFT SIDE */}
        <div className="text-white">

          <span className="text-[#FFD54A] text-2xl lg:text-4xlfont-bold italic block">
            Super Healthy
          </span>

          <h1 className="text-[50px] md:text-[65px] lg:text-[90px] font-black leading-[0.9] uppercase">
            TIFFIN
          </h1>

          <p className="mt-4 text-base lg:text-lg text-white/90 max-w-md">
            Fresh homemade meals delivered daily.
            Choose your meal package and start eating healthy today.
          </p>

          <div className="mt-6 space-y-3">

            <div className="flex items-center gap-3 text-base">
              <FiCheckCircle className="text-[#FFD54A]" />
              Fresh Homemade Meals
            </div>

            <div className="flex items-center gap-3 text-lg">
              <FiCheckCircle className="text-[#FFD54A]" />
              Daily Doorstep Delivery
            </div>

            <div className="flex items-center gap-3 text-lg">
              <FiCheckCircle className="text-[#FFD54A]" />
              Flexible Meal Scheduling
            </div>

          </div>

          <button className="mt-8 bg-white text-red-600 px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-2xl hover:scale-105 transition">
            Explore Packages
            <FiArrowRight />
          </button>

        </div>
        {/* RIGHT SIDE */}

  <div className="relative flex items-center justify-center h-full">

  {/* Background Circle */}
  <div
    className="
    absolute
    w-[340px]
    h-[340px]
    lg:w-[400px]
    lg:h-[400px]
    rounded-full
    bg-gradient-to-br
    from-[#fafafa]
    via-white
    to-[#f1f1f1]
    shadow-[0_20px_60px_rgba(0,0,0,0.10)]
  "
  />

  {/* Main Image */}
  <img
    src="/tiffin.png"
    alt=""
    className="
      relative
      z-20
      w-[320px]
      lg:w-[430px]
      object-contain
      drop-shadow-[0_25px_45px_rgba(0,0,0,0.20)]
      hover:scale-105
      transition-all
      duration-500
    "
  />

  {/* Save Badge */}
  <div
    className="
    absolute
    left-4
    bottom-8
    z-30
    bg-white/90
    backdrop-blur-xl
    border border-white
    rounded-[20px]
    px-4
    py-3
    shadow-xl
  "
  >
    <p className="text-[10px] font-semibold text-gray-500 uppercase">
      Save Upto
    </p>

    <h3 className="text-3xl font-black text-[#E23747]">
      50%
    </h3>
  </div>

  {/* Price Badge */}
  <div
    className="
    absolute
    top-4
    right-0
    z-30
    bg-white/90
    backdrop-blur-xl
    border border-white
    rounded-[20px]
    px-4
    py-3
    shadow-xl
  "
  >
    <p className="text-[10px] text-gray-500">
      Starting From
    </p>

    <h3 className="text-xl font-black text-[#E23747]">
      ₹99/day
    </h3>
  </div>

  {/* Rating Badge */}
  <div
    className="
    absolute
    right-0
    bottom-16
    z-30
    bg-white/90
    backdrop-blur-xl
    border border-white
    rounded-[20px]
    px-4
    py-3
    shadow-xl
  "
  >
    <h3 className="text-lg font-black">
      ⭐ 4.9
    </h3>

    <p className="text-xs text-gray-500">
      Customer Rating
    </p>
  </div>

</div>
      </div>
    </section>
  );
}