import React from "react";

// Apne actual testimonial component ke path ke according change kar lena
import Testimonials from "../../components/User/Testimonials";
import Footer from "../../components/shared/Footer";
import HeroHeader from "../../components/User/HeroHeader";
import GettingStarted from "../../components/User/GettingStarted";

const features = [
  {
    title: "Hygienic & Safe",
    description: "Prepared with care in a clean and hygienic kitchen.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path d="M12 3l7 3v5c0 4.5-2.8 8.3-7 10-4.2-1.7-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Fresh Ingredients",
    description: "Quality ingredients selected for delicious daily meals.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path d="M20 4C12 4 6 8 5 16c4-4 8-6 13-7" />
        <path d="M5 20c0-7 5-13 15-16" />
      </svg>
    ),
  },
  {
    title: "On-Time Delivery",
    description: "Fresh meals delivered reliably to your doorstep.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l3 2M9 2h6" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Choose a Plan",
    description:
      "Explore our meal plans and select the option that fits your lifestyle and daily needs.",
  },
  {
    number: "02",
    title: "Pick Your Meals",
    description:
      "Choose meals from available options and enjoy variety throughout your meal plan.",
  },
  {
    number: "03",
    title: "We Cook Fresh",
    description:
      "Your meals are prepared fresh in our hygienic kitchen using quality ingredients.",
  },
  {
    number: "04",
    title: "We Deliver On Time",
    description:
      "Your freshly prepared meals are carefully packed and delivered to your doorstep.",
  },
  {
    number: "05",
    title: "Enjoy Your Meal",
    description:
      "Open, serve and enjoy comforting home-style meals without the daily cooking stress.",
  },
];

const AboutUsPage = () => {
  return (
    <main className="overflow-hidden bg-white text-slate-900">

        <HeroHeader />
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-[620px] bg-cover bg-center bg-no-repeat lg:min-h-[700px]"
        style={{
          backgroundImage: "url('\WhyChooseUsImage.png')",
        }}
      >
        {/* Soft overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/5" />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:min-h-[700px] lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3 text-sm mt-5">

              <span className="text-slate-400">
                Home
              </span>

              <span className="text-slate-300">
                ›
              </span>

              <span className="font-semibold text-slate-800">
                About   
              </span>

            </div>

            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Good Food.
              <br />
              Timely Delivered.
              <br />
              <span className="text-red-500">Everyday.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              We make everyday meals simple, reliable and satisfying. Our
              mission is to bring fresh, hygienic and comforting home-style
              meals directly to your doorstep, so you can spend more time on
              the things that matter most.
            </p>

            <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="group flex items-start gap-3 rounded-2xl border border-red-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 transition group-hover:bg-red-500 group-hover:text-white">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#10213f]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRO STATS ================= */}
      <section className="relative z-20 -mt-10 px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-100 bg-white px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
          <div className="grid grid-cols-2 gap-y-7 md:grid-cols-4 md:divide-x md:divide-red-100">
            {[
              ["Fresh", "Meals Prepared Daily"],
              ["Quality", "Ingredients First"],
              ["Reliable", "Timely Delivery"],
              ["Simple", "Flexible Meal Plans"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="flex flex-col items-center px-4 text-center"
              >
                <span className="text-2xl font-black text-[#10213f] sm:text-3xl">
                  {value}
                </span>
                <span className="mt-1 text-sm text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left visual */}
          <div className="relative">
            <div className="absolute -left-5 -top-5 h-28 w-28 rounded-3xl bg-red-50" />

            <div className="relative overflow-hidden rounded-[32px] shadow-2xl">
              <img
                src="/about.png"
                alt="Fresh home-style meals prepared with care"
                className="h-[420px] w-full object-cover object-center sm:h-[500px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

              {/* <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/90 p-5 backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-500">
                  Food made with purpose
                </p>
                <h3 className="mt-1 text-xl font-black text-[#10213f]">
                  Fresh. Familiar. Made with care.
                </h3>
              </div> */}
            </div>

            <div className="absolute -bottom-6 -right-5 hidden h-32 w-32 rounded-full border-[20px] border-red-50 lg:block" />
          </div>

          {/* Right content */}
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-red-500">
              Our Story
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight text-[#10213f] sm:text-4xl lg:text-5xl">
              Made With Care,
              <br />
              <span className="text-red-500">Just Like Home</span>
            </h2>

            <div className="mt-7 space-y-5 text-base leading-8 text-slate-600">
              <p>
                We started with one simple belief: good food should make life
                easier, not more complicated. A busy schedule should never mean
                compromising on fresh, comforting and properly prepared meals.
              </p>

              <p>
                Our goal is to bring the warmth of home-style cooking to
                students, working professionals, families and anyone looking
                for a convenient daily meal solution.
              </p>

              <p>
                From choosing ingredients to preparing, packing and delivering
                every meal, we focus on consistency, hygiene and reliability.
                Because for us, delivering food is not only about filling a
                plate. It is about becoming a dependable part of your daily
                routine.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1" />
                  </svg>
                </div>

                <h3 className="text-lg font-black text-[#10213f]">
                  Our Mission
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  To make fresh, convenient and comforting meals easily
                  accessible for everyday life.
                </p>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>

                <h3 className="text-lg font-black text-[#10213f]">
                  Our Vision
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  To become a trusted everyday meal partner known for quality,
                  consistency and genuine customer care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW WE WORK ================= */}
      <section className="relative bg-[#fff8f8] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
     <GettingStarted />
      </section>

      {/* ================= EXISTING TESTIMONIAL SECTION ================= */}
      <section className="bg-white py-20 lg:py-28">
      

          <Testimonials />
       
      </section>
<Footer />
    </main>
  );
};

export default AboutUsPage;