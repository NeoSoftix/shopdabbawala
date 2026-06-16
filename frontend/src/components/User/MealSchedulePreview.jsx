import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MealSchedulePreview() {
  const [step, setStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  const [selectedMeal, setSelectedMeal] =
    useState("Lunch");

  const [selectedCuisine, setSelectedCuisine] =
    useState("");

  const [selectedItems, setSelectedItems] =
    useState([]);

  const meals = [
    {
      emoji: "🍳",
      title: "Breakfast",
      time: "08:00 AM - 10:00 AM",
    },
    {
      emoji: "🍛",
      title: "Lunch",
      time: "01:00 PM - 02:00 PM",
    },
    {
      emoji: "🍽️",
      title: "Dinner",
      time: "07:00 PM - 09:00 PM",
    },
  ];

  const cuisines = {
    Breakfast: [
      "Gujarati",
      "South Indian",
      "Healthy",
      "Continental",
    ],

    Lunch: [
      "Gujarati",
      "North Indian",
      "Punjabi",
      "Healthy Bowl",
    ],

    Dinner: [
      "Gujarati",
      "North Indian",
      "Light Dinner",
      "Punjabi",
    ],
  };

  const foodItems = {
    Gujarati: [
      "Thepla",
      "Dhokla",
      "Khandvi",
      "Fafda",
      "Khichdi",
      "Handvo",
    ],

    "North Indian": [
      "Paneer Butter Masala",
      "Dal Makhani",
      "Butter Naan",
      "Jeera Rice",
      "Rajma Chawal",
    ],

    Punjabi: [
      "Chole Bhature",
      "Paneer Tikka",
      "Amritsari Kulcha",
      "Dal Fry",
    ],

    "South Indian": [
      "Idli",
      "Dosa",
      "Vada",
      "Uttapam",
      "Sambhar Rice",
    ],

    Healthy: [
      "Oats Bowl",
      "Fruit Bowl",
      "Protein Salad",
      "Smoothie",
    ],

    Continental: [
      "Sandwich",
      "Pasta",
      "Garlic Bread",
      "Salad",
    ],

    "Healthy Bowl": [
      "Rice Bowl",
      "Protein Bowl",
      "Veg Bowl",
      "Quinoa Bowl",
    ],

    "Light Dinner": [
      "Soup",
      "Salad",
      "Khichdi",
      "Steamed Veggies",
    ],
  };

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter(
          (i) => i !== item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        item,
      ]);
    }
  };

  const progressWidth =
    step === 1
      ? "0%"
      : step === 2
      ? "25%"
      : step === 3
      ? "50%"
      : step === 4
      ? "75%"
      : "100%";

  return (
    <section
      className="
      bg-white
      rounded-[32px]
      p-8
      border
      border-gray-100
      shadow-[0_15px_40px_rgba(0,0,0,0.06)]
    "
    >
      {/* Header */}

      <div className="mb-10">
        <span
          className="
          inline-flex
          px-4
          py-2
          rounded-full
          bg-red-50
          text-[#E23747]
          font-semibold
          text-sm
        "
        >
          📅 Meal Scheduling
        </span>

        <h2
          className="
          mt-4
          text-3xl
          font-black
          text-gray-900
        "
        >
          Schedule Your Next Meal
        </h2>

        <p className="text-gray-500 mt-2">
          Select date, meal, cuisine and food
          items.
        </p>
      </div>

      {/* Progress */}

      <div className="mb-12">
        <div className="relative flex justify-between">

          <div
            className="
            absolute
            top-5
            left-0
            w-full
            h-1
            bg-gray-200
            rounded-full
          "
          />

          <div
            className="
            absolute
            top-5
            left-0
            h-1
            bg-gradient-to-r
            from-[#E23747]
            to-[#ff6674]
            rounded-full
            transition-all
            duration-500
          "
            style={{
              width: progressWidth,
            }}
          />

          {[
            "Date",
            "Meal",
            "Cuisine",
            "Items",
            "Review",
          ].map((label, index) => (
            <div
              key={label}
              className="
                relative
                z-10
                flex
                flex-col
                items-center
              "
            >
              <div
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  font-bold
                  ${
                    step >= index + 1
                      ? "bg-[#E23747] text-white"
                      : "bg-white border border-gray-300 text-gray-400"
                  }
                `}
              >
                {index + 1}
              </div>

              <span className="mt-2 text-sm font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 */}

      {step === 1 && (
        <div className="grid lg:grid-cols-[1.5fr_.8fr] gap-6">

          <div className="bg-[#fafafa] rounded-[28px] p-6 border">

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              className="border-none w-full"
            />

          </div>

          <div
            className="
            bg-gradient-to-br
            from-[#E23747]
            to-[#ff6674]
            rounded-[28px]
            p-7
            text-white
          "
          >
            <h3 className="text-xl font-bold">
              Selected Date
            </h3>

            <h2 className="text-7xl font-black mt-5">
              {selectedDate.getDate()}
            </h2>

            <p className="mt-2 text-lg">
              {selectedDate.toLocaleDateString(
                "en-IN",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <button
              onClick={() => setStep(2)}
              className="
                mt-10
                h-14
                w-full
                rounded-2xl
                bg-white
                text-[#E23747]
                font-bold
              "
            >
              Continue →
            </button>
          </div>

        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <>
          <button
            onClick={() => setStep(1)}
            className="
            mb-6
            px-6
            py-3
            rounded-xl
            bg-gray-100
          "
          >
            ← Previous
          </button>

          <div className="grid md:grid-cols-3 gap-6">

            {meals.map((meal) => (
              <div
                key={meal.title}
                onClick={() =>
                  setSelectedMeal(meal.title)
                }
                className={`
                  cursor-pointer
                  rounded-[28px]
                  p-8
                  border-2
                  transition-all
                  ${
                    selectedMeal === meal.title
                      ? "border-[#E23747] bg-red-50"
                      : "border-gray-100"
                  }
                `}
              >
                <div className="text-6xl">
                  {meal.emoji}
                </div>

                <h3 className="mt-5 text-2xl font-black">
                  {meal.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {meal.time}
                </p>
              </div>
            ))}

          </div>

          <button
            onClick={() => {
              setSelectedCuisine("");
              setStep(3);
            }}
            className="
              mt-8
              bg-[#E23747]
              text-white
              px-8
              h-14
              rounded-2xl
            "
          >
            Continue →
          </button>
        </>
      )}

      {/* STEP 3 */}

      {step === 3 && (
        <>
          <button
            onClick={() => setStep(2)}
            className="
            mb-6
            px-6
            py-3
            rounded-xl
            bg-gray-100
          "
          >
            ← Previous
          </button>

          <div className="grid md:grid-cols-4 gap-6">

            {cuisines[selectedMeal]?.map(
              (cuisine) => (
                <div
                  key={cuisine}
                  onClick={() =>
                    setSelectedCuisine(cuisine)
                  }
                  className={`
                    cursor-pointer
                    rounded-[24px]
                    p-6
                    border-2
                    transition-all
                    ${
                      selectedCuisine === cuisine
                        ? "border-[#E23747] bg-red-50"
                        : "border-gray-100"
                    }
                  `}
                >
                  <div className="text-5xl">
                    🥘
                  </div>

                  <h3 className="mt-4 font-bold text-lg">
                    {cuisine}
                  </h3>
                </div>
              )
            )}

          </div>

          <button
            disabled={!selectedCuisine}
            onClick={() => setStep(4)}
            className="
              mt-8
              bg-[#E23747]
              text-white
              px-8
              h-14
              rounded-2xl
            "
          >
            Continue →
          </button>
        </>
      )}

      {/* STEP 4 */}

      {step === 4 && (
        <>
          <button
            onClick={() => setStep(3)}
            className="
            mb-6
            px-6
            py-3
            rounded-xl
            bg-gray-100
          "
          >
            ← Previous
          </button>

          <div className="grid md:grid-cols-3 gap-6">

            {foodItems[selectedCuisine]?.map(
              (item) => (
                <div
                  key={item}
                  onClick={() =>
                    toggleItem(item)
                  }
                  className={`
                    cursor-pointer
                    rounded-[24px]
                    p-6
                    border-2
                    transition-all
                    ${
                      selectedItems.includes(
                        item
                      )
                        ? "border-[#E23747] bg-red-50"
                        : "border-gray-100"
                    }
                  `}
                >
                  <div className="text-5xl">
                    🍱
                  </div>

                  <h3 className="mt-4 font-bold">
                    {item}
                  </h3>
                </div>
              )
            )}

          </div>

          <button
            disabled={
              selectedItems.length === 0
            }
            onClick={() => setStep(5)}
            className="
              mt-8
              bg-[#E23747]
              text-white
              px-8
              h-14
              rounded-2xl
            "
          >
            Continue →
          </button>
        </>
      )}

      {/* STEP 5 */}

      {step === 5 && (
        <div
          className="
          bg-gradient-to-r
          from-[#E23747]
          to-[#ff6674]
          rounded-[32px]
          p-8
          text-white
        "
        >
          <h2 className="text-3xl font-black">
            Review Schedule
          </h2>

          <div className="mt-8 space-y-4 text-lg">

            <p>
              📅{" "}
              {selectedDate.toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <p>
              🍱 {selectedMeal}
            </p>

            <p>
              🥘 {selectedCuisine}
            </p>

            <div>
              <p className="font-semibold mb-2">
                Selected Items:
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedItems.map((item) => (
                  <span
                    key={item}
                    className="
                    px-3
                    py-2
                    rounded-full
                    bg-white/20
                  "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <p>
              📍 Home Address
            </p>

          </div>

          <div className="flex gap-4 mt-10">

            <button
              onClick={() => setStep(4)}
              className="
                px-8
                h-14
                rounded-2xl
                bg-white/20
              "
            >
              Previous
            </button>

            <button
              className="
                px-8
                h-14
                rounded-2xl
                bg-white
                text-[#E23747]
                font-bold
              "
            >
              Confirm Schedule
            </button>

          </div>
        </div>
      )}
    </section>
  );
}