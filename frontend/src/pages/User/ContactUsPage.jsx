import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Headphones,
  Building2,
  CreditCard,
  HeartHandshake,
  Send,
  ArrowRight,
  Section,
} from "lucide-react";
import FAQSection from "../../components/User/FAQSection";
import HeroHeader from "../../components/User/HeroHeader";
import Footer from "../../components/shared/Footer";

const ContactUsPage = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactCards = [
    {
      icon: Phone,
      title: "Phone",
      line1: "+91 98765 43210",
      line2: "Mon – Sat, 8 AM – 8 PM",
    },
    {
      icon: Mail,
      title: "Email",
      line1: "hello@shopdabbawala.com",
      line2: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Address",
      line1: "123, Foodie Street, Sector 15",
      line2: "Gurugram, Haryana 122001",
    },
    {
      icon: Clock3,
      title: "Working Hours",
      line1: "Mon – Sat: 8 AM – 8 PM",
      line2: "Sunday: 9 AM – 5 PM",
    },
  ];

  const supportItems = [
    {
      icon: Building2,
      title: "Corporate Office",
      lines: [
        "ShopDabbaWala Foods Private Limited",
        "123, Foodie Street, Sector 15,",
        "Gurugram, Haryana 122001",
      ],
    },
    {
      icon: Headphones,
      title: "Customer Support",
      lines: ["+91 98765 43210", "support@shopdabbawala.com"],
    },
    {
      icon: CreditCard,
      title: "Order & Billing Queries",
      lines: ["+91 98765 43211", "orders@shopdabbawala.com"],
    },
    {
      icon: HeartHandshake,
      title: "Partnerships / Corporate Tie-ups",
      lines: ["+91 98765 43212", "partnerships@shopdabbawala.com"],
    },
  ];

  const deliveryAreas = [
    "Sector 14",
    "Sector 15",
    "Sector 17",
    "DLF Phase 1",
    "DLF Phase 2",
    "Sushant Lok",
    "Udyog Vihar",
    "Golf Course Road",
    "& More",
  ];

 

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact form data:", formData);

    // Connect your API here.
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">

        <HeroHeader />
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-red-50/30 to-white">
        {/* Decorative Elements */}
        <div className="absolute -left-10 top-40 h-24 w-24 rounded-full border border-red-100" />

        <div className="absolute right-[45%] top-16 hidden text-red-100 lg:block">
          <Mail size={42} strokeWidth={1} />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.4fr] lg:px-10 lg:py-24">
          {/* Hero Content */}
          <div>
            <div className="mb-7 flex items-center gap-3 text-sm">
              <span className="text-slate-400">Home</span>
              <span className="text-slate-300">›</span>
              <span className="font-semibold text-slate-800">
                Contact Us
              </span>
            </div>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Let&apos;s Get
              <span className="block text-red-600">
                In Touch
                <span className="ml-2 text-red-400">_</span>
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-slate-500">
              Have a question, suggestion, or need support? We&apos;re here
              to help with your meal plans, deliveries, orders, and
              everything in between.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
                <Headphones size={26} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                  Need Quick Help?
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  Our support team is ready
                </p>
              </div>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {contactCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group flex min-h-[145px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-50"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition-all group-hover:bg-red-600 group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {item.line1}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.line2}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.15fr_0.85fr]">
          {/* Form */}
          <div className="p-6 sm:p-9 lg:p-12">
            <h2 className="text-2xl font-extrabold">
              Send Us a <span className="text-red-600">Message</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              We&apos;ll get back to you as soon as possible.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-5 sm:grid-cols-2"
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="h-14 rounded-xl border border-slate-200 px-5 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="h-14 rounded-xl border border-slate-200 px-5 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="h-14 rounded-xl border border-slate-200 px-5 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="h-14 rounded-xl border border-slate-200 px-5 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50"
              />

              <textarea
                name="message"
                rows={6}
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="resize-none rounded-xl border border-slate-200 p-5 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50 sm:col-span-2"
              />

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-200"
                >
                  Send Message
                  <Send size={17} />
                </button>
              </div>
            </form>
          </div>

          {/* Support */}
          <div className="border-t border-slate-200 bg-slate-50/50 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-12">
            <h2 className="text-2xl font-extrabold">
              Our Office <span className="text-red-600">& Support</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Reach out to us for any queries or assistance.
            </p>

            <div className="mt-7">
              {supportItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`flex gap-4 py-5 ${
                      index !== supportItems.length - 1
                        ? "border-b border-dashed border-slate-200"
                        : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <div className="mt-1">
                        {item.lines.map((line) => (
                          <p
                            key={line}
                            className="text-sm leading-6 text-slate-500"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= DELIVERY AREA ================= */}
      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-2">
          {/* Simple Map Style Area */}
          <div className="relative min-h-[380px] overflow-hidden bg-[#f7faf9]">
            <div className="absolute inset-0 opacity-70">
              {/* Roads */}
              <div className="absolute left-[10%] top-0 h-[130%] w-px rotate-[28deg] bg-slate-300" />
              <div className="absolute left-[40%] top-[-20%] h-[150%] w-px -rotate-[20deg] bg-slate-300" />
              <div className="absolute left-[75%] top-[-20%] h-[140%] w-px rotate-[35deg] bg-slate-200" />

              <div className="absolute left-0 top-[30%] h-px w-full -rotate-[7deg] bg-slate-300" />
              <div className="absolute left-0 top-[65%] h-px w-full rotate-[5deg] bg-slate-300" />

              <div className="absolute left-[60%] top-0 h-full w-8 rotate-[8deg] bg-blue-50" />
            </div>

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-200">
                <MapPin size={28} />
              </div>

              <span className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-bold shadow">
Canada              </span>
            </div>

            <span className="absolute left-[12%] top-[25%] text-xs font-semibold text-slate-400">
              UDYOG VIHAR
            </span>

            <span className="absolute bottom-[22%] left-[20%] text-xs font-semibold text-slate-400">
              SUSHANT LOK
            </span>

            <span className="absolute right-[14%] top-[20%] text-xs font-semibold text-slate-400">
              DLF CYBER CITY
            </span>
          </div>

          {/* Delivery Content */}
          <div className="flex items-center p-7 sm:p-10 lg:p-14">
            <div>
              <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600">
                Our Service Area
              </span>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Where We <span className="text-red-600">Deliver</span>
              </h2>

              <p className="mt-4 max-w-md leading-7 text-slate-500">
                Fresh, hygienic meals delivered on time across Gurugram
                and nearby areas.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {deliveryAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <MapPin size={14} className="text-red-500" />
                    {area}
                  </span>
                ))}
              </div>

              <button className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:gap-3">
                Check if we deliver in your area
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
      <FAQSection />
      </section>

<Section>
    <Footer />
</Section>
    </main>
  );
};

export default ContactUsPage;