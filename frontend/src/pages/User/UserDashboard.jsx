import StatCard from "../../components/Admin/StatsCards";
import NoPackageBanner from "../../components/User/NoPackageBanner";
import PackageSection from "../../components/User/PackageSection";
import QuickActions from "../../components/User/QuickActions";
import GettingStarted from "../../components/User/GettingStarted";
import MealSchedulePreview from "../../components/User/MealSchedulePreview";
import {
  FiPackage,
  FiCalendar,
  FiClipboard,
  FiMapPin,
} from "react-icons/fi";

export default function UserDashboard() {
  return (
    <div className="space-y-8 bg-[#f7f8fc] min-h-screen">

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Available Packages"
          value="6"
          growth="Choose Now"
          Icon={FiPackage}
        />

        <StatCard
          title="Scheduled Meals"
          value="0"
          growth="Not Started"
          Icon={FiCalendar}
        />

        <StatCard
          title="Orders"
          value="0"
          growth="No Orders Yet"
          Icon={FiClipboard}
        />

        <StatCard
          title="Addresses"
          value="1"
          growth="Saved"
          Icon={FiMapPin}
        />

      </div>

      {/* Main Hero */}
      <NoPackageBanner />
      
      {/* Quick Actions */}
      <QuickActions />

       {/* Packages */}
      <PackageSection />
      <MealSchedulePreview />


     

      {/* Guide */}
      <GettingStarted />

    </div>
  );
}