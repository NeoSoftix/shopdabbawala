import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardLineChart({ data, title = "Trend" }) {
  return (
    <div className="w-full h-[350px] bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
      
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h2>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}