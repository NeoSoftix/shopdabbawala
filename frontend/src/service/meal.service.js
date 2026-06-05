import API from "./api.js"


// create meal api 
export const createMeal = async (data) => {
    try {
        const res = await API.post("/meal", data)

        return res.data
    } catch (error) {
        console.log("Create the Meal error", error)
        
        throw error
    }
}


// get active meal api

export const getActiveMeal = async () => {
    try {
        const res = await API.get("/meal/active")

        return res.data
    } catch (error) {
        console.log("Get active category Meal error", error)
        
        throw error
    }
}

// get all meals 

export const getAllMeals = async () => {
    try {
        const res = await API.get("/meal")

        return res.data
    } catch (error) {
        console.log("Get all meals error", error)

        throw error
    }
}

// get one meal api 
export const getOneMeal = async (id) => {
    try {
        const res = await API.get(`/meal/${id}`)

        return res.data
    } catch (error) {
        console.log("Get One meal error", error)

        throw error
    }
}

// update the meal api 

export const updateMeal = async (id, data) => {
    try {
        const res = await API.put(`/meal/${id}`, data)

        return res.data
    } catch (error) {
        console.log("Update the meal error", error)        
    }
}

// toggle mealStatus api 

export const toggleMealStatus = async (id) => {
    try {
        const res = await API.patch(`/meal/${id}/status`)

        return res.data
    } catch (error) {
        console.log("Toggle Meal error", error)
        
        throw error
    }
}

// delete meal service

export const deleteMeal = async (id) => {
    try {
        const res = await API.delete(`/meal/${id}`)

        return res.status
    } catch (error) {
        console.log("Delete the Meal error", error)

        throw error
    }
}


