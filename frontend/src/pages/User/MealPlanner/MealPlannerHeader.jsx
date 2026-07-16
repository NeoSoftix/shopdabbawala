import { LogOut, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MealPlannerHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate("/")}
          className="text-[#A3AED0] hover:text-[#1B254B] text-sm font-medium transition-colors flex items-center gap-2"
        >
          &larr; Back to home
        </button>
        <span className="text-[#A3AED0]">|</span>
        <h1 className="text-[#1B254B] text-sm font-semibold">
          Design / Step-by-Step Meal Selection
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User options removed as requested */}
      </div>
    </header>
  );
}
