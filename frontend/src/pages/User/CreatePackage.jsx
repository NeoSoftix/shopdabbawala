import { useState, useEffect, useMemo } from "react";

import vegIcon from "../../../public/spinach.svg";
import VEGICOn from "../../../public/veg icon.svg";

import PhoneInputPkg from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const PhoneInput = PhoneInputPkg.default ? PhoneInputPkg.default : PhoneInputPkg;

import CheckoutFlowModal from "../../components/shared/CheckoutFlowModal";
import { toast } from "react-hot-toast";

import { createSubscription } from "../../services/subscription.service";
// Nayi service layer import kiya jahan se dynamic plans aayenge
import { getActivePlans } from "../../services/customPlanConfig.service.js";
import { getActiveMealTiers } from "../../services/mealTier.service.js";

import PincodeCheckBar from "./CreatePackage/PincodeCheckBar";
import DeliveryChargeSync from "./CreatePackage/DeliveryChargeSync";
import DeliveryMethodToggle from "./CreatePackage/DeliveryMethodToggle";
import MealPreferenceAndDate from "./CreatePackage/MealPreferenceAndDate";
import DurationAndMealsCard from "./CreatePackage/DurationAndMealsCard";
import MealPlanSelector from "./CreatePackage/MealPlanSelector";
import PlanSummaryCard from "./CreatePackage/PlanSummaryCard";
import ProceedActions from "./CreatePackage/ProceedActions";

export default function CreatePackage({ isOpen, onClose }) {
  // Config States
  const [preference, setPreference] = useState("Veg");

  // Dynamic States from Backend
  const [dbPlans, setDbPlans] = useState([]);
  const [duration, setDuration] = useState(""); // Dynamic initial value handles via useEffect
  const [totalMeals, setTotalMeals] = useState(0);

  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [quantity, setQuantity] = useState(1);
  const [mealSize, setMealSize] = useState("Basic");

  // Admin-configured, per-pincode delivery charge (set via the Delivery
  // Charges admin page). Populated by <DeliveryChargeSync> once the AREA
  // step's pincode is known.
  const [deliveryChargeAmount, setDeliveryChargeAmount] = useState(0);
  const [deliveryChargeLoading, setDeliveryChargeLoading] = useState(false);
  const [deliveryChargeError, setDeliveryChargeError] = useState("");

  // Start Date
  const [startDate, setStartDate] = useState("");

  // Red & White Theme Based Meal Plan State

  const [selectedPlan, setSelectedPlan] = useState("Basic");

  // Meal Tiers (Basic / Medium / Premium etc.) — admin ke MealTierManager se aate hain
  const [mealTiers, setMealTiers] = useState([]);

  // 1. Fetch Dynamic Duration Plans from Backend
  useEffect(() => {
    const fetchDurationPlans = async () => {
      try {
        const res = await getActivePlans();
        const activePlansData = res.data || res || [];
        setDbPlans(activePlansData);

        if (activePlansData.length > 0) {
          // Default selection pehla plan sets karega safely
          const defaultPlan = activePlansData[0];
          setDuration(defaultPlan.durationLabel);
          setTotalMeals(defaultPlan.totalMeals);
        }
      } catch (error) {
        console.error("Error fetching duration plans:", error);
        toast.error("Failed to load live plan durations");
      }
    };
    fetchDurationPlans();
  }, []);

  // 2. Fetch Active Meal Tiers (Basic / Medium / Premium etc., set by admin)
  useEffect(() => {
    const fetchMealTiers = async () => {
      try {
        const res = await getActiveMealTiers();
        const activeTiers = res.data || [];
        setMealTiers(activeTiers);

        if (activeTiers.length > 0) {
          setSelectedPlan(activeTiers[0].name);
        }
      } catch (error) {
        console.error("Error fetching meal tiers:", error);
        toast.error("Failed to load meal plan tiers");
      }
    };
    fetchMealTiers();
  }, []);

  // 3. Unique Duration Labels Extract karne ke liye (Tabs banane ke liye)
  const uniqueDurationLabels = useMemo(() => {
    const labels = dbPlans.map(p => p.durationLabel);
    return [...new Set(labels)];
  }, [dbPlans]);

  // 4. Selected Duration Label ke corresponding sub-options dynamic get karein
  const currentOptions = useMemo(() => {
    return dbPlans
      .filter(p => p.durationLabel === duration)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [dbPlans, duration]);

  // Handle matching choice when user switches tabs smoothly
  useEffect(() => {
    if (currentOptions.length > 0) {
      const matchStillExists = currentOptions.some(o => o.totalMeals === totalMeals);
      if (!matchStillExists) {
        setTotalMeals(currentOptions[0].totalMeals);
      }
    }
  }, [duration, currentOptions, totalMeals]);

  // 5. Dynamic Calculations Engine based on DB values
  const matchedOption = useMemo(() => {
    return currentOptions.find((o) => o.totalMeals === totalMeals) || currentOptions[0];
  }, [currentOptions, totalMeals]);

  // Har meal tier (Basic/Medium/Premium) ki apni price admin ne set ki hai;
  // agar is duration+meal-count combo ke liye tier price set nahi hai to
  // plan ki base price per meal per tier structure daale fallback ban jaata hai.
  const selectedTierPrice = useMemo(() => {
    return matchedOption?.tierPricing?.find(
      (t) => t.mealTier?.name?.trim().toLowerCase() === selectedPlan?.trim().toLowerCase()
    );
  }, [matchedOption, selectedPlan]);

  const basePricePerMeal = selectedTierPrice ? selectedTierPrice.pricePerMeal : (matchedOption ? matchedOption.pricePerMeal : 0);
  const discountPercentage = selectedTierPrice ? selectedTierPrice.discountPercentage : (matchedOption?.discountPercentage ?? 0);

  const pricePerMeal = parseFloat(basePricePerMeal.toFixed(2));
  const subtotal = totalMeals * pricePerMeal * quantity;
  const discount = subtotal * (discountPercentage / 100);
  const deliveryCharges = deliveryMethod === "Delivery" ? deliveryChargeAmount : 0.0;
  const totalAmount = subtotal - discount + deliveryCharges;
  const discountedPricePerMeal = pricePerMeal - (pricePerMeal * discountPercentage) / 100;

  const getCustomizationError = () => {
    if (!startDate) return "Please select a Delivery Start Date from the calendar above.";
    if (dbPlans.length === 0) return "Loading active plan details from server...";
    if (deliveryMethod === "Delivery" && deliveryChargeLoading) return "Checking delivery charge for your pincode...";
    if (deliveryMethod === "Delivery" && deliveryChargeError) return deliveryChargeError;
    return "";
  };
  const validationError = getCustomizationError();

  return (
    <CheckoutFlowModal
      isOpen={isOpen !== undefined ? isOpen : true}
      onClose={onClose || (() => window.history.back())}
      mode="create"
      isCustomizationValid={!validationError}
      customizationErrorMsg={validationError}
      subscriptionData={{
        mealSize: selectedPlan,
        preference,
        totalMeals,
        duration,
        quantity,
        deliveryMethod,
        startDate,
      }}
    >
      {({ goBack, loading, error: submitError, pincode: verifiedPincode }) => (
      <div className={`bg-[#f9f9fb] text-gray-800 font-sans antialiased py-3 px-2 sm:px-4 lg:px-5 relative`}>
            <DeliveryChargeSync
              pincode={verifiedPincode}
              deliveryMethod={deliveryMethod}
              onResult={({ charge, loading, error }) => {
                setDeliveryChargeAmount(charge);
                setDeliveryChargeLoading(loading);
                setDeliveryChargeError(error);
              }}
            />
            <main className="max-w-full bg-white/50 rounded-3xl">
              <PincodeCheckBar pincode={verifiedPincode} />

              {/* ================= HEADER AREA ================= */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1.5 pb-1.5 border-b border-gray-200/60 px-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
                    Create Your Plan
                  </h1>
                  <p className="text-gray-500 text-xs max-w-2xl leading-relaxed">
                    Customize your culinary journey with premium ingredients delivered to your doorstep.
                  </p>
                </div>

                {/* Pickup / Delivery selector — desktop, sits in the header */}
                <div className="hidden lg:block bg-white p-1 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] shrink-0">
                  <DeliveryMethodToggle value={deliveryMethod} onChange={setDeliveryMethod} />
                </div>
              </div>

              {/* Pickup / Delivery selector */}
              <div className="lg:hidden px-2 mb-3">
                <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <DeliveryMethodToggle value={deliveryMethod} onChange={setDeliveryMethod} fullWidth />
                </div>
              </div>

              {/* Main Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 content-start">
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {/* Row 1: Preference & Timing */}
                  <MealPreferenceAndDate
                    preference={preference}
                    onPreferenceChange={setPreference}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                  />

                  {/* Row 2: Dynamic Duration & Total Meals */}
                  <DurationAndMealsCard
                    uniqueDurationLabels={uniqueDurationLabels}
                    duration={duration}
                    onDurationChange={setDuration}
                    currentOptions={currentOptions}
                    totalMeals={totalMeals}
                    onTotalMealsChange={setTotalMeals}
                    selectedPlan={selectedPlan}
                  />

                  {/* Meal Plan Selector — flex-1 so it stretches to match the right
                      column's height instead of leaving blank space beneath it */}
                  <MealPlanSelector
                    mealTiers={mealTiers}
                    selectedPlan={selectedPlan}
                    onSelectPlan={setSelectedPlan}
                  />
                </div>

                {/* Right Side Stack */}
                <div className="flex flex-col gap-3 relative z-10">
                  {/* Plan Summary Card */}
                  <PlanSummaryCard
                    selectedPlan={selectedPlan}
                    preference={preference}
                    startDate={startDate}
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    duration={duration}
                    deliveryMethod={deliveryMethod}
                    totalMeals={totalMeals}
                    subtotal={subtotal}
                    discount={discount}
                    discountPercentage={discountPercentage}
                    deliveryCharges={deliveryCharges}
                    deliveryChargeLoading={deliveryMethod === "Delivery" && deliveryChargeLoading}
                    deliveryChargeError={deliveryMethod === "Delivery" ? deliveryChargeError : ""}
                    totalAmount={totalAmount}
                    pricePerMeal={discountedPricePerMeal}
                  />

                  {/* Proceed / Go Back — directly below Plan Summary in the same sticky stack */}
                  <ProceedActions submitError={submitError} loading={loading} onGoBack={goBack} />
                </div>
              </div>
            </main>
          </div>
      )}
    </CheckoutFlowModal>
  );
}
