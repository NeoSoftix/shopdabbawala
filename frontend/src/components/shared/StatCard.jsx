import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  growth,
  Icon,
}) {
  return (
    <div
      className="
      relative
      overflow-hidden
      bg-white
      rounded-[24px]
      p-3
      border border-gray-100
      shadow-[0_8px_25px_rgba(0,0,0,0.05)]
      hover:shadow-[0_15px_35px_rgba(226,55,71,0.10)]
      hover:-translate-y-1
      transition-all
      duration-300
    "
    >
      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E23747] to-[#ff6b77]" />

      <div className="flex items-start justify-between">
        {/* Left */}
        <div>
          <p className="text-[12px] text-gray-500 font-medium">
            {title}
          </p>

          <h3 className="mt-2 text-xl font-black text-gray-900 leading-none">
            {value}
          </h3>

          <div className="mt-3">
            <span
              className="
              inline-flex
              items-center
              gap-1
              px-2.5
              py-1
              rounded-full
              bg-green-50
              text-green-600
              text-[12px]
              font-semibold
            "
            >
              <TrendingUp size={12} /> {growth}
            </span>
          </div>
        </div>

        {/* Icon */}
        <div
          className="
          w-10
          h-10
          rounded-2xl
          bg-gradient-to-br
          from-[#E23747]
          to-[#ff6674]
          flex
          items-center
          justify-center
          shadow-[0_8px_20px_rgba(226,55,71,0.25)]
        "
        >
          <Icon
            size={15}
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
}