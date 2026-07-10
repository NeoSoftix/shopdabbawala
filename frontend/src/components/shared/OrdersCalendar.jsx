import { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiEye, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {
  getOrderCountsByMonth,
  getOrdersByDate,
  markOrderReadyToDeliver,
  markOrderDelivered,
} from '../../services/order.service';
import OrderDetailsModal from './OrderDetailsModal';

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-600',
  Preparing: 'bg-indigo-50 text-indigo-600',
  'On the way': 'bg-blue-50 text-blue-600',
  Delivered: 'bg-green-50 text-green-600',
  Cancelled: 'bg-slate-100 text-slate-500',
};

export default function OrdersCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);

  const [orderCounts, setOrderCounts] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  const formatDateStr = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedDateStr = formatDateStr(selectedDate);

  // Fetch order counts whenever the visible month changes
  useEffect(() => {
    let isCancelled = false;
    const fetchCounts = async () => {
      setLoadingCounts(true);
      try {
        const res = await getOrderCountsByMonth(year, month + 1);
        if (!isCancelled) setOrderCounts(res.counts || {});
      } catch {
        if (!isCancelled) setOrderCounts({});
      } finally {
        if (!isCancelled) setLoadingCounts(false);
      }
    };
    fetchCounts();
    return () => { isCancelled = true; };
  }, [year, month]);

  // Fetch orders whenever the selected date changes
  const fetchOrdersForDate = useCallback(async (dateStr) => {
    setLoadingOrders(true);
    try {
      const res = await getOrdersByDate(dateStr);
      setSelectedOrders(res.orders || []);
    } catch {
      setSelectedOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersForDate(selectedDateStr);
  }, [selectedDateStr, fetchOrdersForDate]);

  const handleReadyToDeliver = async (orderId) => {
    try {
      const res = await markOrderReadyToDeliver(orderId);
      if (res.success) {
        toast.success("Order marked as ready to deliver");
        fetchOrdersForDate(selectedDateStr);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order");
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const res = await markOrderDelivered(orderId);
      if (res.success) {
        toast.success("Order marked as delivered");
        fetchOrdersForDate(selectedDateStr);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Left Panel: Calendar */}
      <div className="flex-grow xl:w-2/3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button onClick={goToToday} className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
              Today
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            {monthNames[month]} {year}
            {loadingCounts && <FiLoader className="w-4 h-4 animate-spin text-slate-400" />}
          </h2>

          <div className="flex bg-slate-900 rounded-lg p-1 text-white text-xs font-semibold">
            <button className="px-4 py-1.5 bg-slate-700 rounded-md">Month</button>
            <button className="px-4 py-1.5 hover:bg-slate-800 rounded-md transition-colors">Week</button>
            <button className="px-4 py-1.5 hover:bg-slate-800 rounded-md transition-colors">Day</button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="min-h-[100px] border-b border-r border-slate-100 bg-slate-50/50" />;
              }

              const dateStr = formatDateStr(date);
              const isSelected = selectedDateStr === dateStr;
              const isToday = formatDateStr(today) === dateStr;
              const count = orderCounts[dateStr] || 0;
              const hasOrders = count > 0;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-[100px] p-2 border-b border-r border-slate-100 cursor-pointer transition-all hover:bg-slate-50 relative group ${
                    isSelected ? 'bg-red-50/50 ring-2 ring-red-500 ring-inset z-10' : ''
                  }`}
                >
                  <div className={`text-right text-sm font-semibold mb-1 ${
                    isToday ? 'text-red-600' : 'text-slate-700'
                  }`}>
                    {isToday ? <span className="bg-red-600 text-white w-6 h-6 inline-flex items-center justify-center rounded-full text-xs">{date.getDate()}</span> : date.getDate()}
                  </div>

                  {hasOrders && (
                    <div className="mt-1 flex flex-col gap-1">
                      <div className={`text-[10px] font-bold px-1.5 py-1 rounded-md w-full truncate ${
                        isSelected ? 'bg-red-600 text-white shadow-sm' : 'bg-red-100 text-red-700 group-hover:bg-red-200'
                      }`}>
                        Deliveries: {count}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: Selected Bookings */}
      <div className="xl:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-[700px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-800">Selected Bookings</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {selectedDateStr}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          {loadingOrders ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <FiLoader className="w-6 h-6 animate-spin" />
              <p className="text-sm font-medium">Loading deliveries...</p>
            </div>
          ) : selectedOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <FiEye className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-medium">No deliveries for this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <div className="col-span-3">ID</div>
                <div className="col-span-4">Customer</div>
                <div className="col-span-3 text-center">Status</div>
                <div className="col-span-2 text-center">Action</div>
              </div>

              {/* Data rows */}
              {selectedOrders.map((order) => (
                <div key={order._id} className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-white border border-slate-100 rounded-xl hover:border-red-200 hover:shadow-sm transition-all group">
                  <div className="col-span-3 text-xs font-bold text-slate-700 truncate" title={order._id}>
                    {order._id.slice(-6).toUpperCase()}
                  </div>
                  <div className="col-span-4 text-xs font-semibold text-slate-600 truncate">
                    {order.user?.name || 'N/A'}
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      statusStyles[order.status] || 'bg-slate-100 text-slate-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setDetailsOrder(order)}
                      title="View order details"
                      className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors group-hover:scale-105"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <OrderDetailsModal
        order={detailsOrder}
        onClose={() => setDetailsOrder(null)}
        onReadyToDeliver={handleReadyToDeliver}
        onMarkDelivered={handleMarkDelivered}
      />
    </div>
  );
}
