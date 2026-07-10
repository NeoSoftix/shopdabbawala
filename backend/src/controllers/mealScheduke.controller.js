// This file is kept at its original (typo'd) path/name for backward compatibility
// with existing imports (see src/routes/mealSchedule.routes.js). The actual
// implementations now live under ./mealSchedule/ split by concern:
//   - initMealPlan.controller.js  -> meal plan initialization
//   - daySchedule.controller.js   -> daily schedule updates
//   - address.controller.js       -> meal plan address management
//   - mealSchedule.controller.js  -> meal schedule create/fetch

export { updateDaySchedule } from "./mealSchedule/daySchedule.controller.js";
export { addMealPlanAddress, deleteMealPlanAddress } from "./mealSchedule/address.controller.js";
export { createMealSchedule, getMyMealPlan, getDayStatuses, updateDayOrderStatus } from "./mealSchedule/mealSchedule.controller.js";
