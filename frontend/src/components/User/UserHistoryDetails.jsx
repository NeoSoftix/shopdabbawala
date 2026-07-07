import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, ChevronDown, ChevronRight, 
  Headphones, Truck, X, ShoppingBag, PlusCircle, AlertCircle
} from 'lucide-react';
import { getMyMealPlan } from '../../services/mealSchedule.service';

export default function UserHistoryDetails({ subscriptions }) {
  // Tabs state: 'past', 'today', 'upcoming'
  const [activeTab, setActiveTab] = useState('upcoming');
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeSub = subscriptions?.find(sub => sub.status === "active") || subscriptions?.[0];

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const data = await getMyMealPlan();
        if (data.success && data.mealPlan) {
          setMealPlan(data.mealPlan);
        }
      } catch (err) {
        console.error("Failed to fetch meal plan for history", err);
      } finally {
        setLoading(false);
      }
    };
    if (activeSub) {
      fetchPlan();
    } else {
      setLoading(false);
    }
  }, [activeSub]);

  // Helper to format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get current day string (e.g., "Monday")
  const todayString = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = mealPlan?.schedule ? mealPlan.schedule[todayString] : null;

  // Upcoming Days logic
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const getUpcomingDays = () => {
    if (!mealPlan?.schedule) return [];
    
    let upcoming = [];
    let currentDayIndex = new Date().getDay(); 
    // JS getDay(): 0=Sunday, 1=Monday... 
    // Shift so 0=Monday
    currentDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

    for (let i = 1; i <= 5; i++) {
      let nextIndex = (currentDayIndex + i) % 7;
      let dayName = daysOfWeek[nextIndex];
      let scheduleForDay = mealPlan.schedule[dayName];
      
      let nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + i);

      let tags = [];
      if (scheduleForDay && scheduleForDay.items && scheduleForDay.items.length > 0) {
        // Group by category conceptually, or just list names
        tags = scheduleForDay.items.slice(0, 3).map(item => item.item?.name || "Meal");
      }

      upcoming.push({
        label: i === 1 ? "Tomorrow" : dayName,
        date: formatDate(nextDate),
        tags: tags.length > 0 ? tags : ["No items scheduled"],
        hasItems: tags.length > 0
      });
    }
    return upcoming;
  };

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
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center space-x-2 pb-3 px-1 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'upcoming' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Next Plan</span>
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
            {/* --- UPCOMING SCHEDULED DAYS SECTION --- */}
            {activeTab === 'upcoming' && (
              <section className="space-y-4 fade-in">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Scheduled Days</h2>
                {!mealPlan ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Your meal plan is not initialized yet. Please build your custom schedule in the "Build Custom Meal" tab.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {getUpcomingDays().map((day, i) => (
                        <div key={i} className={`border ${day.hasItems ? 'border-red-100 bg-red-50/20' : 'border-gray-100 bg-gray-50/50'} rounded-xl p-4 text-center flex flex-col justify-between items-center space-y-3`}>
                          <div className="space-y-1">
                            <span className="text-xs text-gray-400 block font-medium">{day.label}</span>
                            <span className="text-xs font-bold text-gray-800 block">{day.date}</span>
                          </div>
                          <div className="w-full flex flex-wrap gap-1 justify-center">
                            {day.tags.map((tag, tIdx) => (
                              <span key={tIdx} className={`font-semibold text-[10px] px-1.5 py-0.5 rounded border ${day.hasItems ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-100 text-gray-500 border-gray-200'} truncate max-w-full`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* --- TODAY'S ORDER SECTION --- */}
            {activeTab === 'today' && (
              <section className="space-y-4 fade-in">
                <h2 className="text-lg font-bold text-gray-900">Today's Delivery ({todayString})</h2>
                
                {!mealPlan ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Your meal plan is not initialized yet.</p>
                  </div>
                ) : !todaySchedule || todaySchedule.items.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                      🍽️
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Meals Today</h3>
                    <p className="text-sm text-gray-500">You don't have any meals scheduled for today.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4 space-y-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-red-500" />
                            <span className="font-bold text-gray-900 text-lg">{formatDate(new Date())}</span>
                            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-md">Today</span>
                          </div>
                        </div>
                        <div className="space-y-3 pt-2">
                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold block text-gray-800">Delivery Method</span>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{activeSub?.deliveryMethod || "Delivery"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Scheduled Items</span>
                        <div className="space-y-3">
                          {todaySchedule.items.map((itemObj, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                              <div className="flex items-center space-x-3">
                                <div className="bg-red-50 p-2.5 rounded-full text-red-500">
                                  <ShoppingBag className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-800">{itemObj.item?.name || "Meal Item"}</h4>
                                  <p className="text-xs text-gray-400">Qty: {itemObj.qty || 1}</p>
                                </div>
                              </div>
                              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">Scheduled</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* --- PURCHASE HISTORY SECTION --- */}
            {activeTab === 'past' && (
              <section className="space-y-4 fade-in">
                <h2 className="text-lg font-bold text-gray-900">Purchase History</h2>
                
                <div className="space-y-4">
                  {subscriptions && subscriptions.map((sub, idx) => (
                    <div key={sub._id || idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <div className="flex items-start space-x-4">
                          <div className="bg-red-50 text-red-600 p-2.5 rounded-lg mt-0.5">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-gray-900 capitalize">{sub.duration || "Custom"} Plan Purchase ({sub.mealSize || "Custom"})</span>
                            <p className="text-xs text-gray-400">Purchased on: {formatDate(sub.createdAt)}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                              <span className="flex items-center space-x-1">
                                <span className="font-semibold text-gray-700">Total Meals:</span>
                                <span>{sub.totalMeals}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span className="font-semibold text-gray-700">Meals Used:</span>
                                <span>{sub.mealsUsed}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 px-0 md:px-8 flex-1 max-w-xs md:border-l md:border-r md:border-gray-100">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">Status</h4>
                            <p className="text-xs text-gray-500 capitalize">{sub.status}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end space-x-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                            {sub.status === 'active' ? 'Active' : sub.status}
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