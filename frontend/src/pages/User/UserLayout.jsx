import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
{/* 
      <main className="p-6"> */}
        <main>
        <Outlet />
      </main>
    </div>
  );
}