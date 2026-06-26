import PackageSection from "../../components/User/PackagesSection";
import GettingStarted from "../../components/User/GettingStarted";
import Footer from "../../components/Footer";
// import Hero from "../../components/Hero";
import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";
// import ThaliShowCase from "../../components/ThaliShowCase";
import { DEMO_SLIDES } from "../../components/HeroCarousel/HeroCarousel.stories";
import TiffinRendor from "../../components/TiffinRendor/TiffinRendor";
import PerfectMatchFoodHero from "../../components/User/PerfectMatchFoodHero";
import HeroHeader from "../../components/HeroHeader";
import AddonsSection from "../../components/User/AddOnsSection";
import FAQSection from "../../components/User/FAQSection";
import WhyChooseUs from "../../components/User/WhyChooseUs";
export default function UserDashboard() {
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
      <FAQSection />
      <Footer />
    </div>
  );
}
