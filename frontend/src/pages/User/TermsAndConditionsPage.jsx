import React from "react";
import Footer from "../../components/shared/Footer";
import HeroHeader from "../../components/User/HeroHeader";

const SECTIONS = [
  {
    title: "1. Account Registration and Security",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>To place an order or subscribe to a tiffin plan, you must create an account on our platform.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials (username and password).</li>
        <li>You agree to provide accurate, current, and complete information during the registration and checkout process.</li>
        <li>We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</li>
      </ul>
    ),
  },
  {
    title: "2. Tiffin Subscriptions and Orders",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-semibold text-slate-900">Menu &amp; Customization:</span> Our menus change periodically. While we try our best to accommodate general preferences, custom modifications to standard daily meals may not always be possible unless explicitly stated.
        </li>
        <li>
          <span className="font-semibold text-slate-900">Allergies Notice:</span> Our meals are prepared in a commercial kitchen that handles nuts, gluten, dairy, and other allergens. It is your responsibility to inform us of severe allergies, though we cannot guarantee a completely allergen-free environment.
        </li>
      </ul>
    ),
  },
  {
    title: "3. Pricing, Billing, and Payments",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>All prices listed on the website are in Canadian Dollars (CAD) unless specified otherwise, and applicable taxes will be added at checkout.</li>
        <li>
          <span className="font-semibold text-slate-900">Subscription Billing:</span> If you opt for a weekly or monthly tiffin plan, your payment method will be charged automatically at the start of the subscription cycle.
        </li>
        <li>We use secure third-party payment processors. Shopdabbawala does not store your credit/debit card details on our servers.</li>
      </ul>
    ),
  },
  {
    title: "4. Delivery Policy",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-semibold text-slate-900">Delivery Areas &amp; Timings:</span> We deliver strictly within designated zones. Delivery time slots provided at checkout are estimates and can vary due to traffic, weather, or unforeseen circumstances.
        </li>
        <li>
          <span className="font-semibold text-slate-900">Drop-off Protocol:</span> If you are not home during delivery, our rider will leave the tiffin at your doorstep, with concierge, or as per your specific delivery notes. Shopdabbawala is not responsible for spoiled or stolen food after it has been delivered to the designated drop-off spot.
        </li>
        <li>
          <span className="font-semibold text-slate-900">Access:</span> You must ensure that our delivery personnel have reasonable access to your building or property.
        </li>
      </ul>
    ),
  },
  {
    title: "5. Cancellations, Pausing, and Refund Policy",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-semibold text-slate-900">Pausing Subscriptions:</span> You can pause your subscription (e.g., if you are traveling) by notifying us or updating your dashboard at least 24 to 48 hours before the next scheduled delivery.
        </li>
        <li>
          <span className="font-semibold text-slate-900">Cancellations:</span> You can cancel your subscription at any time. Refunds for the remaining days of an active cycle will be processed on a pro-rata basis, subject to a small processing fee, provided notice is given within our specified cutoff time.
        </li>
        <li>
          <span className="font-semibold text-slate-900">Quality Issues:</span> If you receive a damaged package or have legitimate quality concerns, please contact us within 3 hours of delivery with photographic proof for a resolution (replacement or partial credit).
        </li>
      </ul>
    ),
  },
  {
    title: "6. Intellectual Property",
    body: (
      <p>
        All content on this website—including logos, graphics, text, UI design, and software—is the intellectual property of Shopdabbawala and is protected by copyright laws. You may not copy, reproduce, or distribute any content without our prior written consent.
      </p>
    ),
  },
  {
    title: "7. Limitation of Liability",
    body: (
      <p>
        Shopdabbawala shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or consumption of our meals, except as required under applicable Canadian consumer protection laws.
      </p>
    ),
  },
  {
    title: "8. Governing Law",
    body: (
      <p>
        These Terms and Conditions are governed by and construed in accordance with the laws of the Province of British Columbia (BC), Canada, without regard to its conflict of law principles.
      </p>
    ),
  },
  {
    title: "9. Contact Us",
    body: (
      <>
        <p>For any questions, clarifications, or disputes regarding these Terms, please reach out to us:</p>
        <ul className="mt-3 space-y-1.5">
          <li><span className="font-semibold text-slate-900">Brand Name:</span> Shopdabbawala</li>
          <li><span className="font-semibold text-slate-900">Email:</span> info@prepplates.com</li>
          <li><span className="font-semibold text-slate-900">Phone:</span> +1 (778) 312-1686</li>
          <li><span className="font-semibold text-slate-900">Address:</span> 1668 Fosters Way, Delta, BC V3M 6S6, Canada</li>
        </ul>
      </>
    ),
  },
];

const TermsAndConditionsPage = () => {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HeroHeader />

      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-red-50/40 to-white">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mb-5 flex items-center gap-3 text-sm">
            <a href="/" className="text-slate-400 transition hover:text-red-600">Home</a>
            <span className="text-slate-300">›</span>
            <span className="font-semibold text-slate-800">Terms and Conditions</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Terms &amp; <span className="text-red-600">Conditions</span>
          </h1>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Last Updated: July 10, 2026
          </p>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500">
            Welcome to <span className="font-semibold text-slate-700">Shopdabbawala</span> (accessible via{" "}
            <a
              href="https://tiffin-delivery-app.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-red-600 underline decoration-red-200 underline-offset-2 hover:text-red-700"
            >
              tiffin-delivery-app.vercel.app
            </a>
            ). These Terms and Conditions (&quot;Terms&quot;) govern your use of our website and our tiffin delivery
            services. By accessing our website and subscribing to or purchasing our services, you agree to be bound
            by these Terms.
          </p>

          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
            If you do not agree with any part of these Terms, please do not use our website or services.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-lg font-extrabold text-red-600 sm:text-xl">
                {section.title}
              </h2>
              <div className="mt-3 space-y-1 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsAndConditionsPage;
