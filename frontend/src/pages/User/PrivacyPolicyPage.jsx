import React from "react";
import Footer from "../../components/shared/Footer";
import HeroHeader from "../../components/User/HeroHeader";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: (
      <>
        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-slate-900">Personal Data:</span> Personally identifiable information, such as your name, shipping/delivery address, email address, and telephone number, that you voluntarily give to us when you register on the website or place an order.
          </li>
          <li>
            <span className="font-semibold text-slate-900">Order and Billing Information:</span> Details about the tiffin plans you subscribe to, delivery preferences, and transactional information. We do not store your credit/debit card details; all payments are processed securely through our third-party payment gateway partners.
          </li>
          <li>
            <span className="font-semibold text-slate-900">Location Data:</span> We may request access or tracking to location-based information from your device to ensure accurate and timely delivery of your tiffin.
          </li>
          <li>
            <span className="font-semibold text-slate-900">Device and Log Data:</span> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, and access times.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    body: (
      <>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Create and manage your personal account.</li>
          <li>Process your daily orders, subscriptions, and payments.</li>
          <li>Deliver your tiffin to the correct address via our delivery partners.</li>
          <li>Send you order confirmations, delivery updates, and administrative messages.</li>
          <li>Respond to your customer service requests and support needs.</li>
          <li>Send you promotional offers, discounts, and updates about new menus (you can opt-out at any time).</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Sharing Your Information",
    body: (
      <>
        <p>We do not sell, trade, or rent your personal identification information to others. We may share information we have collected about you in certain situations:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-slate-900">Delivery Partners:</span> We share your name, address, and phone number with our delivery personnel or third-party logistics partners strictly to fulfill your food delivery.
          </li>
          <li>
            <span className="font-semibold text-slate-900">Third-Party Service Providers:</span> We may share your information with third parties that perform services for us or on our behalf, such as payment processing, data analysis, email delivery, and hosting services.
          </li>
          <li>
            <span className="font-semibold text-slate-900">Legal Obligations:</span> We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, or a judicial proceeding.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Data Security",
    body: (
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
      </p>
    ),
  },
  {
    title: "5. Cookies and Tracking Technologies",
    body: (
      <p>
        We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
      </p>
    ),
  },
  {
    title: "6. Your Rights and Choices",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-semibold text-slate-900">Account Information:</span> You may at any time review or change the information in your account or terminate your account by logging into your account settings or contacting us.
        </li>
        <li>
          <span className="font-semibold text-slate-900">Emails and Communications:</span> If you no longer wish to receive correspondence, emails, or promotional materials from us, you may opt-out by clicking the &apos;unsubscribe&apos; link in the emails or contacting us directly.
        </li>
      </ul>
    ),
  },
  {
    title: "7. Changes to This Privacy Policy",
    body: (
      <p>
        We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the &quot;Last Updated&quot; date of this Privacy Policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the Site.
      </p>
    ),
  },
  {
    title: "8. Contact Us",
    body: (
      <>
        <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
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

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HeroHeader />

      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-red-50/40 to-white">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mb-5 flex items-center gap-3 text-sm">
            <a href="/" className="text-slate-400 transition hover:text-red-600">Home</a>
            <span className="text-slate-300">›</span>
            <span className="font-semibold text-slate-800">Privacy Policy</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Privacy <span className="text-red-600">Policy</span>
          </h1>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Last Updated: July 10, 2026
          </p>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500">
            Welcome to <span className="font-semibold text-slate-700">Shopdabbawala</span> (accessible via{" "}
            <a
              href="http://13.233.160.69/"
              target="_blank"
              rel="noreferrer"
              className="text-red-600 underline decoration-red-200 underline-offset-2 hover:text-red-700"
            >
              13.233.160.69
            </a>
            ). We respect your privacy and are committed to protecting the personal data you share with us. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
            website and tiffin delivery services.
          </p>

          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
            please do not access the site.
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

export default PrivacyPolicyPage;
