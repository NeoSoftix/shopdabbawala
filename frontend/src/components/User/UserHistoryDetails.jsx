import { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Headphones, ShoppingBag, AlertCircle, Package, Receipt
} from 'lucide-react';
import { SiStripe } from 'react-icons/si';
import { getMyOrders } from '../../services/order.service';

const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-blue-100 text-blue-700',
  'On the way': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-500',
};

export default function UserHistoryDetails({ subscriptions }) {
  // Tabs state: 'past', 'today', 'history'
  const [activeTab, setActiveTab] = useState('history');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders(page, 10);
        if (data.success) {
          setOrders(data.orders || []);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch orders for history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  // Helper to format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper to format Date + time together, for transaction timestamps
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  // "YYYY-MM-DD" for today, to match against order.date (stored as a real Date now)
  const todayKey = new Date().toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD
  const todayLabel = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayOrders = orders.filter(order => order.date && new Date(order.date).toLocaleDateString('en-CA') === todayKey);

  const statusBadgeClass = (status) => STATUS_STYLES[status] || 'bg-gray-100 text-gray-500';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">View your subscription history, today's order and your upcoming schedule.</p>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="border-b border-gray-200 flex space-x-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 pb-3 px-1 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center space-x-2 pb-3 px-1 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'today' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Today's Order</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`flex items-center space-x-2 pb-3 px-1 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'past' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Purchase History</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm">Loading schedule...</p>
          </div>
        ) : (
          <>
            {/* --- ORDER HISTORY SECTION --- */}
            {activeTab === 'history' && (
              <section className="space-y-4 fade-in">
                <h2 className="text-lg font-bold text-gray-900">Your Orders</h2>
                {orders.length === 0 ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>You don't have any orders yet. Build your custom schedule in the "Build Custom Meal" tab.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-red-50 text-red-600 p-2.5 rounded-lg mt-0.5">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-gray-900">{formatDate(order.date)}{order.planName ? ` — ${order.planName}` : ''}</span>
                            <p className="text-xs text-gray-400">Last updated: {formatDate(order.updatedAt)}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {(order.items || []).map((it, idx) => (
                                <span key={idx} className="text-[11px] font-semibold px-1.5 py-0.5 rounded border bg-gray-50 text-gray-600 border-gray-200">
                                  {it.name || 'Item'} x{it.qty || 1}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setPage((prev) => prev - 1)}
                      disabled={page <= 1}
                      className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <span className="text-sm font-medium text-gray-600">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={page >= totalPages}
                      className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* --- TODAY'S ORDER SECTION --- */}
            {activeTab === 'today' && (
              <section className="space-y-4 fade-in">
                <h2 className="text-lg font-bold text-gray-900">Today's Delivery ({todayLabel})</h2>

                {todayOrders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                      🍽️
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Meals Today</h3>
                    <p className="text-sm text-gray-500">You don't have any meals scheduled for today.</p>
                  </div>
                ) : (
                  todayOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 space-y-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-5 h-5 text-red-500" />
                              <span className="font-bold text-gray-900 text-lg">{formatDate(new Date())}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${statusBadgeClass(order.status)}`}>{order.status}</span>
                            </div>
                            {order.planName && <p className="text-xs text-gray-500">{order.planName}</p>}
                          </div>
                          <div className="space-y-3 pt-2">
                            <div className="flex items-start space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold block text-gray-800">Delivery Address</span>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{order.deliveryAddress || "Not set"}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold block text-gray-800">Delivery Slot</span>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{order.deliveryTimeSlot}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Scheduled Items</span>
                          <div className="space-y-3">
                            {(order.items || []).map((itemObj, idx) => (
                              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-red-50 p-2.5 rounded-full text-red-500">
                                    <ShoppingBag className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-800">{itemObj.name || "Meal Item"}</h4>
                                    <p className="text-xs text-gray-400">Qty: {itemObj.qty || 1}</p>
                                  </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadgeClass(order.status)}`}>{order.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </section>
            )}

            {/* --- PURCHASE HISTORY SECTION --- */}
            {activeTab === 'past' && (
              <section className="space-y-4 fade-in">
                <h2 className="text-lg font-bold text-gray-900">Purchase History</h2>

                <div className="space-y-4">
                  {(!subscriptions || subscriptions.length === 0) ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>You haven't purchased any plan yet.</p>
                    </div>
                  ) : subscriptions.map((sub, idx) => (
                    <div key={sub._id || idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <div className="flex items-center space-x-4">
                          <div className="bg-red-50 text-red-600 p-2.5 rounded-lg">
                            {sub.package ? <Package className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                          </div>
                          <span className="font-bold text-gray-900 capitalize">
                            {sub.package?.name || `${sub.duration || "Custom"} Plan`} ({sub.mealSize || "Custom"})
                          </span>
                        </div>

                        <div className="flex flex-col space-y-2 px-0 md:px-8 flex-1 max-w-sm md:border-l md:border-r md:border-gray-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5" /> Transaction Details
                          </h4>
                          {sub.payment ? (
                            <>
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <span className="font-semibold text-gray-700">Txn ID:</span>
                                <span className="font-mono truncate max-w-[160px]" title={sub.payment.transactionId}>
                                  {sub.payment.transactionId}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <span className="font-semibold text-gray-700">Date &amp; Time:</span>
                                <span>{formatDateTime(sub.payment.paidAt || sub.payment.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <span className="font-semibold text-gray-700">Paid via:</span>
                                <span className="inline-flex items-center gap-1 bg-[#635BFF]/10 text-[#635BFF] font-semibold px-1.5 py-0.5 rounded">
                                  <SiStripe className="w-3.5 h-3.5" /> {sub.payment.gateway}
                                </span>
                              </div>
                              {typeof sub.payment.amount === "number" && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                  <span className="font-semibold text-gray-700">Amount:</span>
                                  <span>{(sub.payment.currency || "usd").toUpperCase()} {sub.payment.amount}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No transaction record found.</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between md:justify-end space-x-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            sub.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : sub.status === 'expired'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {sub.status === 'active' ? 'Active' : sub.status === 'expired' ? 'Expired' : sub.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* --- FOOTER ASSISTANCE AREA --- */}
        <footer className="bg-red-50/60 rounded-xl p-5 border border-red-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="bg-red-100 text-red-500 p-3 rounded-full">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Need Help?</h3>
              <p className="text-xs text-gray-500 mt-0.5">If you face any issue with your deliveries, we are here to help.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto border border-red-500 text-red-500 font-semibold hover:bg-red-50 text-xs px-6 py-2.5 rounded-lg transition shadow-sm">
            Contact Support
          </button>
        </footer>
      </main>

    </div>
  );
}
