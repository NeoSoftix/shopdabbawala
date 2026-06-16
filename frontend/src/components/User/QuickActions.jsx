import {
  FiPackage,
  FiCalendar,
  FiClipboard,
} from "react-icons/fi";

const actions = [
  {
    title: "Browse Packages",
    desc: "Explore meal plans",
    icon: FiPackage,
  },
  {
    title: "Schedule Meals",
    desc: "Plan your meals",
    icon: FiCalendar,
  },
  {
    title: "My Orders",
    desc: "Track all orders",
    icon: FiClipboard,
  },
];



export default function QuickActions() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">
        Quick Actions ⚡
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white/70 backdrop-blur-xl rounded-[28px] p-7 shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(226,55,71,0.15)] transition-all duration-500 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E23747] to-[#ff6875] text-white flex items-center justify-center shadow-lg">
                <Icon size={28} />
              </div>

              <h3 className="text-xl font-semibold mt-5">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-2">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}