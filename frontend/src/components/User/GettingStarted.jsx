export default function GettingStarted() {
  const steps = [
    {
      no: "01",
      title: "Choose Package",
      desc: "Select a meal package according to your lifestyle.",
    },
    {
      no: "02",
      title: "Schedule Meals",
      desc: "Plan breakfast, lunch and dinner in advance.",
    },
    {
      no: "03",
      title: "Enjoy Delivery",
      desc: "Receive fresh homemade meals every day.",
    },
  ];

  return (
    <section className="bg-white rounded-[32px] p-10 shadow-[0_15px_50px_rgba(0,0,0,0.06)]">
      <h2 className="text-3xl font-bold mb-8">
        How It Works 🚀
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.no}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E23747] to-[#ff5d6c] text-white flex items-center justify-center text-xl font-bold shadow-lg">
              {step.no}
            </div>

            <h3 className="text-xl font-semibold mt-5">
              {step.title}
            </h3>

            <p className="text-gray-500 mt-3">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}