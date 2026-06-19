import API from "./api";

// get servcie area 
export const getServiceArea = async () => {
    try {
        const res = await API.get("/vendor/service-area")

        return res.data
    } catch (error) {
        console.log("Get Service Area error", error)
        
        throw error
    }
}

//  for add Service Area 
export const addServiceArea = (data) => {
    try {
        const res = await API.patch("/vendor/select-zone")

        return res.data
    } catch (error) {
        console.log("Add Service Area Error", error)

        throw error
    }
}

//  for Remove Service Area
export const removeServiceArea = () => {
    try {
        const res = await API.patch("/vendor/deselect-zone")

        return res.data
    } catch (error) {
         console.log("Remove Service Area Error", error)

        throw error
    }
    }
