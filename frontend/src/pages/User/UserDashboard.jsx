import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import PackageSection from "../../components/User/PackagesSection";
import GettingStarted from "../../components/User/GettingStarted";
import Footer from "../../components/shared/Footer";
import TiffinRendor from "../../components/User/TiffinRendor";
import PerfectMatchFoodHero from "../../components/User/PerfectMatchFoodHero";
import HeroHeader from "../../components/User/HeroHeader";
import AddonsSection from "../../components/User/AddOnsSection";
import FAQSection from "../../components/User/FAQSection";
import Testimonials from "../../components/User/Testimonials";
import WhyChooseUs from "../../components/User/WhyChooseUs";

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // We no longer forcefully redirect the user from the home page.
  // If they want to go to their dashboard, they can click "Dashboard" in the header.

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <HeroHeader />
      <TiffinRendor />
      {/* <Hero /> */}
      {/* <ThaliShowCase />*/}
      <PackageSection />
      {/* 
      <HeroCarousel
        slides={DEMO_SLIDES}
        autoPlay={true}
        autoPlayInterval={3500}
        height="100vh"
      /> */}
      <PerfectMatchFoodHero />
      <AddonsSection />
      <WhyChooseUs />
      <GettingStarted />
      <Testimonials />
      <FAQSection />
      <Footer />
    </div>
  );
}
