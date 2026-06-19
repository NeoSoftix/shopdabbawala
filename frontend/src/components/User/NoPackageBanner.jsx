import {
  FiArrowRight,
  FiCheckCircle,
  FiTruck,
  FiStar,
} from "react-icons/fi";

export default function NoPackageBanner() {
  return (
    <section
  className="
  relative
  overflow-hidden
  bg-[linear-gradient(135deg,#8F1F2D_0%,#B82838_45%,#CF3040_100%)]
  "
>
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#CF3040]/40 rounded-full blur-[140px]" />

      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#CF3040]/30 rounded-full blur-[120px]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CF3040]/15 rounded-full blur-[180px]" />

      <div className="relative z-10 px-8 lg:px-16 py-14 lg:py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div>

            <span
              className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/10
              border
              border-white/10
              backdrop-blur
              text-[#F8B5BC]
              text-sm
              font-medium
              "
            >
              🍱 Fresh Homemade Meals
            </span>

            <h1 className="mt-6 text-5xl lg:text-7xl font-black leading-[0.95]">

              <span className="text-white">
                Healthy
              </span>

              <br />

              <span className="text-[#F8B5BC]">
                Homemade Meals
              </span>

              <br />

              <span className="text-white">
                Delivered Daily
              </span>

            </h1>

            <p className="mt-6 text-lg text-white/75 max-w-xl leading-relaxed">
              Enjoy healthy homemade meals prepared fresh every
              day and delivered straight to your doorstep.
              Delicious, hygienic and hassle-free.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mt-8">

              <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-white backdrop-blur">
                <FiCheckCircle className="text-[#F8B5BC]" />
                Fresh Daily
              </div>

              <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-white backdrop-blur">
                <FiTruck className="text-[#F8B5BC]" />
                Free Delivery
              </div>

              <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-white backdrop-blur">
                <FiStar className="text-[#F8B5BC]" />
                4.9 Rating
              </div>

            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">

              <button
                className="
                h-14
                px-8
                rounded-xl
                bg-[#CF3040]
                hover:bg-[#B92A39]
                text-white
                font-bold
                flex
                items-center
                gap-3
                transition-all
                duration-300
                hover:scale-105
                shadow-[0_15px_40px_rgba(207,48,64,0.45)]
                "
              >
                Explore Plans
                <FiArrowRight />
              </button>

              <button
                className="
                h-14
                px-8
                rounded-xl
                bg-white/10
                border
                border-white/10
                text-white
                backdrop-blur
                hover:bg-white/20
                transition
                "
              >
                View Menu
              </button>

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">

            {/* Glow */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[#CF3040]/25 blur-[100px]" />

            {/* Premium Circle */}
            <div className="absolute w-[430px] h-[430px] rounded-full border border-[#F8B5BC]/20" />

            {/* Price Badge */}
            <div className="absolute top-8 right-0 z-30 bg-white rounded-2xl px-5 py-4 shadow-2xl">

              <p className="text-xs text-gray-500">
                Starting From
              </p>

              <h3 className="text-2xl font-black text-[#CF3040]">
                ₹99/day
              </h3>

            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-16 left-0 z-30 bg-white rounded-2xl px-5 py-4 shadow-2xl">

              <div className="flex items-center gap-2">
                <FiStar className="text-[#CF3040]" />
                <span className="font-bold">
                  4.9 Rating
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Loved by Customers
              </p>

            </div>

            {/* Main Image */}
            <img
              src="/tiffin.png"
              alt="Tiffin"
              className="
              relative
              z-20
              w-[400px]
              lg:w-[540px]
              object-contain
              transition-all
              duration-500
              hover:scale-105
              drop-shadow-[0_0_100px_rgba(207,48,64,0.55)]
              "
            />

          </div>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mt-14">

          <div
            className="
            bg-white/10
            border
            border-white/10
            backdrop-blur-xl
            rounded-[24px]
            p-6
            transition-all
            duration-300
            hover:bg-white/15
            hover:border-[#CF3040]/50
            "
          >
            <h3 className="text-4xl font-black text-white">
              5000+
            </h3>

            <p className="text-white/70 mt-2">
              Meals Delivered
            </p>
          </div>

          <div
            className="
            bg-white/10
            border
            border-white/10
            backdrop-blur-xl
            rounded-[24px]
            p-6
            transition-all
            duration-300
            hover:bg-white/15
            hover:border-[#CF3040]/50
            "
          >
            <h3 className="text-4xl font-black text-white">
              4.9★
            </h3>

            <p className="text-white/70 mt-2">
              Customer Rating
            </p>
          </div>

          <div
            className="
            bg-white/10
            border
            border-white/10
            backdrop-blur-xl
            rounded-[24px]
            p-6
            transition-all
            duration-300
            hover:bg-white/15
            hover:border-[#CF3040]/50
            "
          >
            <h3 className="text-4xl font-black text-white">
              100%
            </h3>

            <p className="text-white/70 mt-2">
              Fresh & Hygienic
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}