import NoPackageBanner from "../../components/User/NoPackageBanner";
import PackageSection from "../../components/User/PackageSection";
import GettingStarted from "../../components/User/GettingStarted";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";
import ThaliShowCase from "../../components/ThaliShowCase";

export default function UserDashboard() {
  return (
    <div className="space-y-8 bg-[#f7f8fc] min-h-screen">
      <Hero />
      <ThaliShowCase />
      <NoPackageBanner />


      <PackageSection />


      <GettingStarted />
      <Footer />

    </div>
  );
}