import {
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiSmile,
  FiArrowRight,
} from "react-icons/fi";

export default function GettingStarted() {
  const steps = [
    {
      icon: <FiPackage />,
      title: "Choose Package",
      desc: "Select your meals, duration & preferences",
    },
    {
      icon: <FiShoppingBag />,
      title: "Place Order",
      desc: "Confirm your package and complete checkout",
    },
    {
      icon: <FiTruck />,
      title: "We Deliver",
      desc: "Fresh homemade meals delivered daily",
    },
    {
      icon: <FiSmile />,
      title: "Enjoy Meals",
      desc: "Healthy food delivered right to your doorstep",
    },
  ];

  return (
    <section className="py-16 bg-white rounded-[32px]">

      <div className="text-center mb-14">

        <h2 className="text-4xl font-black text-gray-900">
          How It Works
        </h2>

        <div className="w-16 h-1 bg-[#E23747] rounded-full mx-auto mt-3" />

      </div>

      <div className="grid lg:grid-cols-4 gap-8 relative">

        {steps.map((step, index) => (
          <div
            key={index}
            className="relative text-center"
          >

            {/* Arrow */}
            {index !== steps.length - 1 && (
              <div className="hidden lg:flex absolute top-10 -right-8 text-[#E23747] text-2xl">
                <FiArrowRight />
              </div>
            )}

            {/* Icon Circle */}
            <div
              className="
                w-24
                h-24
                mx-auto
                rounded-full
                bg-white
                border
                border-red-100
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                flex
                items-center
                justify-center
                text-[#E23747]
                text-4xl
                transition
                duration-300
                hover:-translate-y-2
                hover:shadow-[0_15px_40px_rgba(226,55,71,0.15)]
              "
            >
              {step.icon}
            </div>

            {/* Step Number */}
            <div className="mt-4 text-[#E23747] font-bold text-sm">
              Step {index + 1}
            </div>

            {/* Title */}
            <h3 className="mt-2 text-lg font-bold text-gray-900">
              {step.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-500 max-w-[220px] mx-auto">
              {step.desc}
            </p>

          </div>
        ))}
      </div>
    </section>
  );
}