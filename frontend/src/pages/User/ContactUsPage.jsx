import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitContactQuery } from "../../services/contact.service";

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
  Plus,
  Minus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import FAQSection from "../../components/User/FAQSection";
import Footer from "../../components/shared/Footer"
import HeroHeader from "../../components/User/HeroHeader";
/* =====================================================
   CONTACT DETAILS
===================================================== */

const PHONE_DISPLAY = "+1 (778) 312-1686";
const PHONE_LINK = "+17783121686";

const CONTACT_EMAIL = "info@prepplates.com";

const ADDRESS =
  "1668 Fosters Way, Delta, BC V3M 6S6, Canada";

const GOOGLE_MAP_LINK =
  "https://www.google.com/maps?ll=49.162572,-122.975668&z=16&t=m&hl=en&gl=IN&mapclient=embed&q=1668+Fosters+Wy+Delta,+BC+V3M+6S6+Canada";

const GOOGLE_MAP_EMBED =
  "https://www.google.com/maps?q=49.162572,-122.975668&z=16&output=embed";


const NAME_REGEX = /^[a-zA-Z\s'.-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the backend's validateContactPayload so the user sees the same
// rule broken instantly, without waiting on a round-trip to the server.
const validateContactField = (name, value) => {
  const trimmed = (value || "").trim();

  switch (name) {
    case "name":
      if (!trimmed) return "Full name is required.";
      if (trimmed.length < 2 || trimmed.length > 100) return "Full name must be between 2 and 100 characters.";
      if (!NAME_REGEX.test(trimmed)) return "Full name can only contain letters, spaces, apostrophes and hyphens.";
      return "";
    case "email":
      if (!trimmed) return "Email address is required.";
      if (trimmed.length > 150) return "Email address is too long.";
      if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address.";
      return "";
    case "phone": {
      if (!trimmed) return "Phone number is required.";
      const digitsOnly = trimmed.replace(/\D/g, "");
      if (digitsOnly.length < 7 || digitsOnly.length > 15) return "Phone number must be between 7 and 15 digits.";
      return "";
    }
    case "subject":
      if (!trimmed) return "Subject is required.";
      if (trimmed.length < 3 || trimmed.length > 150) return "Subject must be between 3 and 150 characters.";
      return "";
    case "message":
      if (!trimmed) return "Message is required.";
      if (trimmed.length < 10 || trimmed.length > 2000) return "Message must be between 10 and 2000 characters.";
      return "";
    default:
      return "";
  }
};

const ContactUsPage = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });


  /* =====================================================
     CONTACT CARDS
  ===================================================== */

  const contactCards = [
    {
      icon: Phone,
      title: "Phone",
      line1: PHONE_DISPLAY,
      line2: "Call us for quick assistance",
      href: `tel:${PHONE_LINK}`,
    },

    {
      icon: Mail,
      title: "Email",
      line1: CONTACT_EMAIL,
      line2: "We reply as soon as possible",
      href: `mailto:${CONTACT_EMAIL}`,
    },

    {
      icon: MapPin,
      title: "Address",
      line1: "1668 Fosters Way",
      line2: "Delta, BC V3M 6S6, Canada",
      href: GOOGLE_MAP_LINK,
    },

    {
      icon: Clock3,
      title: "Working Hours",
      line1: "Monday – Saturday",
      line2: "Contact us for service timings",
      href: null,
    },
  ];


  /* =====================================================
     SUPPORT INFORMATION
  ===================================================== */

  const supportItems = [
    {
      icon: Building2,
      title: "Our Location",
      lines: [
        "1668 Fosters Way",
        "Delta, BC V3M 6S6",
        "Canada",
      ],
    },

    {
      icon: Headphones,
      title: "Customer Support",
      lines: [
        PHONE_DISPLAY,
        CONTACT_EMAIL,
      ],
    },

    {
      icon: CreditCard,
      title: "Orders & General Queries",
      lines: [
        PHONE_DISPLAY,
        CONTACT_EMAIL,
      ],
    },

    {
      icon: HeartHandshake,
      title: "Partnerships & Corporate Enquiries",
      lines: [
        PHONE_DISPLAY,
        CONTACT_EMAIL,
      ],
    },
  ];


  

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    if (submitStatus.type) {
      setSubmitStatus({
        type: "",
        message: "",
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: validateContactField(name, value),
    }));
  };


  /* =====================================================
     FORM SUBMIT

     Validates every field, then submits to our own backend which stores
     the query and emails the team - on success, redirects to /thank-you.
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate every field before submitting; stop and show all errors if
    // anything fails, instead of a generic "invalid form" message.
    const nextFieldErrors = {
      name: validateContactField("name", formData.name),
      email: validateContactField("email", formData.email),
      phone: validateContactField("phone", formData.phone),
      subject: validateContactField("subject", formData.subject),
      message: validateContactField("message", formData.message),
    };
    setFieldErrors(nextFieldErrors);

    const hasErrors = Object.values(nextFieldErrors).some(Boolean);
    if (hasErrors) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the highlighted fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    setSubmitStatus({
      type: "",
      message: "",
      
    });

    try {
      const res = await submitContactQuery(formData);

      if (!res || !res.success) {
        throw new Error(res?.message || "Unable to submit the form.");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      navigate("/thank-you", {
        state: {
          referenceId: res.referenceId,
          submittedAt: res.submittedAt,
          supportEmail: CONTACT_EMAIL,
        },
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Sorry, your message could not be sent. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="min-h-screen bg-white text-slate-900">

        <section>

            <HeroHeader />
            </section>

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-red-50/40 to-white">

        {/* Decorative Elements */}

        <div className="absolute -left-12 top-32 h-32 w-32 rounded-full border border-red-100" />

        <div className="absolute right-[45%] top-16 hidden text-red-100 lg:block">
          <Mail size={45} strokeWidth={1} />
        </div>

        <div className="absolute bottom-10 right-10 grid grid-cols-5 gap-2 opacity-30">
          {Array.from({ length: 20 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-red-400"
            />
          ))}
        </div>


        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.4fr] lg:px-10 lg:py-24">


          {/* LEFT CONTENT */}

          <div>

            <div className="mb-3 flex items-center gap-3 text-sm mt-5">

              <span className="text-slate-400">
                Home
              </span>

              <span className="text-slate-300">
                ›
              </span>

              <span className="font-semibold text-slate-800">
                Contact Us
              </span>

            </div>


            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">

              Let&apos;s Get

              <span className="block text-red-600">
                In Touch
                <span className="ml-2 text-red-400">
                  _
                </span>
              </span>

            </h1>


            <p className="mt-6 max-w-md text-base leading-8 text-slate-500">

              Have a question, suggestion, or need support?
              We&apos;re here to help with your meal plans,
              deliveries, orders, and everything in between.

            </p>


            <div className="mt-8 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">

                <Headphones size={26} />

              </div>


              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-red-500">
                  Need Quick Help?
                </p>

                <a
                  href={`tel:${PHONE_LINK}`}
                  className="mt-1 block font-bold text-slate-900 transition hover:text-red-600"
                >
                  {PHONE_DISPLAY}
                </a>

              </div>

            </div>

          </div>


          {/* CONTACT CARDS */}

          <div className="grid gap-4 sm:grid-cols-2">

            {contactCards.map((item) => {

              const Icon = item.icon;

              const CardWrapper = item.href ? "a" : "div";

              return (

                <CardWrapper
                  key={item.title}

                  {...(
                    item.href
                      ? {
                          href: item.href,

                          target:
                            item.title === "Address"
                              ? "_blank"
                              : undefined,

                          rel:
                            item.title === "Address"
                              ? "noreferrer"
                              : undefined,
                        }
                      : {}
                  )}

                  className="group flex min-h-[145px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-50"
                >

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white">

                    <Icon size={27} />

                  </div>


                  <div>

                    <h3 className="text-lg font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {item.line1}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.line2}
                    </p>

                  </div>

                </CardWrapper>

              );
            })}

          </div>

        </div>

      </section>



      {/* =================================================
          CONTACT FORM & SUPPORT
      ================================================= */}

      <section className="px-5 py-12 sm:px-8 lg:px-10">

        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.15fr_0.85fr]">


          {/* CONTACT FORM */}

          <div className="p-6 sm:p-9 lg:p-12">

            <h2 className="text-2xl font-extrabold sm:text-3xl">

              Send Us a{" "}

              <span className="text-red-600">
                Message
              </span>

            </h2>


            <p className="mt-2 text-sm text-slate-500">
              We&apos;ll get back to you as soon as possible.
            </p>


            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-5 sm:grid-cols-2"
            >


              {/* FULL NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={`h-14 w-full rounded-xl border px-5 text-sm outline-none transition focus:ring-4 ${
                    fieldErrors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-50"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.name}</p>
                )}

              </div>


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  maxLength={150}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={`h-14 w-full rounded-xl border px-5 text-sm outline-none transition focus:ring-4 ${
                    fieldErrors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-50"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.email}</p>
                )}

              </div>


              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  required
                  maxLength={20}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={`h-14 w-full rounded-xl border px-5 text-sm outline-none transition focus:ring-4 ${
                    fieldErrors.phone
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-50"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.phone}</p>
                )}

              </div>


              {/* SUBJECT */}

              <div>

                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  required
                  maxLength={150}
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldErrors.subject)}
                  className={`h-14 w-full rounded-xl border px-5 text-sm outline-none transition focus:ring-4 ${
                    fieldErrors.subject
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-50"
                  }`}
                />
                {fieldErrors.subject && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.subject}</p>
                )}

              </div>


              {/* MESSAGE */}

              <div className="sm:col-span-2">

                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={2000}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldErrors.message)}
                  className={`w-full resize-none rounded-xl border p-5 text-sm outline-none transition focus:ring-4 ${
                    fieldErrors.message
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-50"
                  }`}
                />
                {fieldErrors.message && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.message}</p>
                )}

              </div>


              {/* STATUS MESSAGE */}

              {submitStatus.message && (

                <div className="sm:col-span-2">

                  <div
                    className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                      submitStatus.type === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >

                    {submitStatus.type === "success" ? (

                      <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0"
                      />

                    ) : (

                      <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0"
                      />

                    )}

                    <span>
                      {submitStatus.message}
                    </span>

                  </div>

                </div>

              )}


              {/* SUBMIT BUTTON */}

              <div className="sm:col-span-2">

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message

                      <Send size={17} />
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>



          {/* =================================================
              SUPPORT SIDE
          ================================================= */}

          <div className="border-t border-slate-200 bg-slate-50/60 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-12">

            <h2 className="text-2xl font-extrabold sm:text-3xl">

              Our Office{" "}

              <span className="text-red-600">
                & Support
              </span>

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



      {/* =================================================
          LOCATION SECTION
      ================================================= */}

      <section className="px-5 py-8 sm:px-8 lg:px-10">

        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.15fr_0.85fr]">


          {/* GOOGLE MAP */}

          <div className="relative min-h-[420px]">

            <iframe
              title="Prep Plates Location"
              src={GOOGLE_MAP_EMBED}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

          </div>


          {/* LOCATION DETAILS */}

          <div className="flex items-center p-7 sm:p-10 lg:p-14">

            <div>

              <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600">
                Our Location
              </span>


              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">

                Come{" "}

                <span className="text-red-600">
                  Find Us
                </span>

              </h2>


              <p className="mt-4 max-w-md leading-7 text-slate-500">

                Have questions about meals, orders, delivery,
                or our services? Visit us or get in touch with
                our team.

              </p>


              {/* ADDRESS */}

              <div className="mt-7 flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">

                  <MapPin size={23} />

                </div>

                <div>

                  <p className="font-bold text-slate-900">
                    Our Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {ADDRESS}
                  </p>

                </div>

              </div>


              {/* OPEN MAP BUTTON */}

              <a
                href={GOOGLE_MAP_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-200"
              >

                View on Google Maps

                <ExternalLink size={17} />

              </a>

            </div>

          </div>

        </div>

      </section>



      {/* =================================================
          FAQ SECTION
      ================================================= */}

      <section className="px-5 py-16 sm:px-8 lg:px-10">
<FAQSection />

      </section>


<section>
    <Footer />
</section>
    
    </main>
  );
};

export default ContactUsPage;