import API from "./api.js"

// create package 
export const createPackage = async (data) => {
    try {
        const res = await API.post(`/packages`, data)

        return res.data
    } catch (error) {
        console.log("Creat package error", error)

        throw error
    }
}

// get all active package 
export const getActivePackage = async () => {
    try {
        const res = await API.get("/packages")

        return res.data
    } catch (error) {
        console.log("Get active package error", error)

        throw error
    }
}

// get all package 
export const getAllPackage = async (req, res) => {
    try {
        const res = await API.get("/packages")

        return res.data
    } catch (error) {
        console.log("Get All package error", error)
        
        throw error
    }
}

// get one package 
export const getOnePackage = async (id) => {
    try {
        const res = await API.get(`/packages/${id}`, id)

        return res.data
    } catch (error) {
        console.log("Get One package error", error)
        
        throw error
    }
}

