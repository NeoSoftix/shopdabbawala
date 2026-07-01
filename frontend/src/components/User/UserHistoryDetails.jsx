import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, ChevronDown, ChevronRight, 
  Headphones, Truck, X, ShoppingBag, PlusCircle 
} from 'lucide-react';

export default function MyOrders() {
  // Tabs state: 'past', 'today', 'upcoming'
  const [activeTab, setActiveTab] = useState('past');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample Detailed Data for Modal (Prices removed from main items, but kept for add-ons)
  const orderDetailsDump = {
    '#ORD12345': {
      id: '#ORD12345',
      date: '30 Jun 2026',
      time: '12:30 PM - 01:00 PM',
      address: '123, Green Park, Near Metro Station, New Delhi - 110016',
      items: [
        { name: 'Standard Lunch Tiffin (Dal, Roti, Rice, Sabzi)', qty: 1 },
        { name: 'Standard Dinner Tiffin (Paneer, Roti, Rice)', qty: 1 }
      ],
      addons: [
        { name: 'Extra Butter Roti (2 pcs)', qty: 1, price: '₹30' },
        { name: 'Sweet Lassi', qty: 1, price: '₹40' }
      ]
    },
    '#ORD12344': {
      id: '#ORD12344',
      date: '29 Jun 2026',
      time: '12:30 PM - 01:00 PM',
      address: '123, Green Park, Near Metro Station, New Delhi - 110016',
      items: [
        { name: 'Premium Breakfast (Poha + Sprouts)', qty: 1 },
        { name: 'Standard Lunch Tiffin', qty: 1 },
        { name: 'Standard Dinner Tiffin', qty: 1 }
      ],
      addons: [
        { name: 'Extra Curd', qty: 1, price: '₹20' }
      ]
    },
    '#ORD12343': {
      id: '#ORD12343',
      date: '28 Jun 2026',
      time: '12:30 PM - 01:00 PM',
      address: '123, Green Park, Near Metro Station, New Delhi - 110016',
      items: [
        { name: 'Standard Lunch Tiffin', qty: 1 },
        { name: 'Standard Dinner Tiffin', qty: 1 }
      ],
      addons: []
    }
  };

  const openDetailsModal = (orderId) => {
    setSelectedOrder(orderDetailsDump[orderId] || orderDetailsDump['#ORD12345']);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
      
      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View your past orders, today's order and your upcoming schedule.</p>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="border-b border-gray-200 flex space-x-8">
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex items-center space-x-2 pb-3 px-1 font-semibold border-b-2 transition-colors ${
              activeTab === 'past' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Past Orders</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex items-center space-x-2 pb-3 px-1 font-semibold border-b-2 transition-colors ${
              activeTab === 'today' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Today's Order</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center space-x-2 pb-3 px-1 font-semibold border-b-2 transition-colors ${
              activeTab === 'upcoming' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Next Plan</span>
          </button>
        </div>

        {/* --- PAST ORDERS SECTION --- */}
        {activeTab === 'past' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Past Orders</h2>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
              {[
                { id: '#ORD12345', date: '30 Jun 2026', meals: 'Lunch, Dinner', count: '2 Meals' },
                { id: '#ORD12344', date: '29 Jun 2026', meals: 'Breakfast, Lunch, Dinner', count: '3 Meals' },
                { id: '#ORD12343', date: '28 Jun 2026', meals: 'Lunch, Dinner', count: '2 Meals' },
              ].map((order, i) => (
                <div key={i} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-50 text-red-600 p-2.5 rounded-lg mt-0.5">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-gray-900">{order.date}</span>
                      <p className="text-xs text-gray-400">Order ID: {order.id}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>12:30 PM - 01:00 PM</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>Home</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 px-0 md:px-8 flex-1 max-w-xs md:border-l md:border-r md:border-gray-100">
                    <div className="bg-red-50 p-2 rounded-lg text-red-600">🍲</div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{order.meals}</h4>
                      <p className="text-xs text-gray-400">{order.count}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-4">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Delivered
                    </span>
                    <button 
                      onClick={() => openDetailsModal(order.id)}
                      className="border border-red-500 text-red-500 hover:bg-red-50 transition text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="p-3 text-center">
                <button className="text-red-500 hover:text-red-600 font-semibold text-sm inline-flex items-center space-x-1">
                  <span>View More Orders</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- TODAY'S ORDER SECTION --- */}
        {activeTab === 'today' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Today's Order</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <span className="font-bold text-gray-900 text-lg">01 Jul 2026</span>
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-md">Today</span>
                    </div>
                    <p className="text-xs text-gray-400">Order ID: #ORD12346</p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">12:30 PM - 01:00 PM</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block text-gray-800">Home</span>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">123, Green Park, Near Metro Station,<br />New Delhi - 110016</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button className="w-full md:w-auto border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-sm px-6 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm transition">
                      <Truck className="w-4 h-4" />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Meals</span>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-50 p-2.5 rounded-full text-red-500">☕</div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">Breakfast</h4>
                          <p className="text-xs text-gray-400">Poha, Banana, Chutney</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Delivered</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-50 p-2.5 rounded-full text-red-500">🍲</div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">Lunch</h4>
                          <p className="text-xs text-gray-400">Dal, Rice, Mix Veg, Roti, Salad</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Delivered</span>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-50 p-2.5 rounded-full text-red-500">🍽️</div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">Dinner</h4>
                          <p className="text-xs text-gray-400">Paneer Curry, Roti, Salad</p>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">On the way</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border-t border-red-100 p-2.5 text-center flex items-center justify-center space-x-2 text-xs font-semibold text-red-600">
                <Clock className="w-4 h-4" />
                <span>Expected Delivery: 12:30 PM - 01:00 PM</span>
              </div>
            </div>
          </section>
        )}

        {/* --- UPCOMING SCHEDULED DAYS SECTION --- */}
        {activeTab === 'upcoming' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Scheduled Days</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[
                  { label: 'Tomorrow', date: '02 Jul 2026', tags: ['Breakfast'] },
                  { label: 'Thursday', date: '03 Jul 2026', tags: ['Lunch', 'Dinner'] },
                  { label: 'Friday', date: '04 Jul 2026', tags: ['Breakfast', 'Lunch', 'Dinner'] },
                  { label: 'Saturday', date: '05 Jul 2026', tags: ['Lunch', 'Dinner'] },
                  { label: 'Monday', date: '07 Jul 2026', tags: ['Breakfast', 'Lunch', 'Dinner'] },
                ].map((day, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50 flex flex-col justify-between items-center space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 block font-medium">{day.label}</span>
                      <span className="text-xs font-bold text-gray-800 block">{day.date}</span>
                    </div>
                    <div className="w-full flex flex-wrap gap-1 justify-center">
                      {day.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="bg-red-50 text-red-500 font-semibold text-[10px] px-1.5 py-0.5 rounded border border-red-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <button className="text-red-500 hover:text-red-600 font-semibold text-sm inline-flex items-center space-x-1">
                  <span>View Full Schedule</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- FOOTER ASSISTANCE AREA --- */}
        <footer className="bg-red-50/60 rounded-xl p-5 border border-red-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="bg-red-100 text-red-500 p-3 rounded-full">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Need Help?</h3>
              <p className="text-xs text-gray-500 mt-0.5">If you face any issue with your order, we are here to help.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto border border-red-500 text-red-500 font-semibold hover:bg-red-50 text-xs px-6 py-2.5 rounded-lg transition shadow-sm">
            Contact Support
          </button>
        </footer>
      </main>

      {/* --- DETAILS POPUP MODAL --- */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                <p className="text-xs text-gray-400 mt-0.5">ID: {selectedOrder.id} • {selectedOrder.date}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              
              {/* Delivery Info */}
              <div className="bg-red-50/40 border border-red-100/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-red-600 uppercase tracking-wide">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Home</p>
                <p className="text-xs text-gray-400 leading-relaxed">{selectedOrder.address}</p>
                <div className="pt-1 flex items-center space-x-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Slot: {selectedOrder.time}</span>
                </div>
              </div>

              {/* Items Section (Price Removed) */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Main Tiffin Items ({selectedOrder.items.length})</span>
                </div>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">Quantity: {item.qty}</p>
                      </div>
                      {/* Price row completely omitted here */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Addons Section (Price Stays Active) */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add-ons ({selectedOrder.addons.length})</span>
                </div>
                {selectedOrder.addons.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedOrder.addons.map((addon, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-800">{addon.name}</p>
                          <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">Quantity: {addon.qty}</p>
                        </div>
                        <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg text-xs">{addon.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-400 bg-gray-50 p-2.5 rounded-lg text-center">No add-ons selected for this order.</p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2 rounded-xl transition shadow-md"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}