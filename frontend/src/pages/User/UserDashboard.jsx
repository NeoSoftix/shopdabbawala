import PackageSection from "../../components/User/PackagesSection";
import GettingStarted from "../../components/User/GettingStarted";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";
import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";
// import ThaliShowCase from "../../components/ThaliShowCase";
import { DEMO_SLIDES } from "../../components/HeroCarousel/HeroCarousel.stories";


export default function UserDashboard() {
  return (
    <div className="space-y-8 bg-[#f7f8fc] min-h-screen">
      <Hero />
      {/* <ThaliShowCase />*/}


      <PackageSection />

      <HeroCarousel
        slides={DEMO_SLIDES}
        autoPlay={true}
        autoPlayInterval={3000}
        height="100vh"
      />


      <GettingStarted />
      <Footer />

    </div>
  );
}