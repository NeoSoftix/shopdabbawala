// Generic white rounded card wrapper. For dashboard stat tiles use StatCard
// instead — this is for list-item/section/form containers.
export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
