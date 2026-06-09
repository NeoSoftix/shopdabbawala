import API from "./api"

// sigup api 

export const signup = async (data) => {
    try {
        const res = await API.post("/auth/signup", data)

        return res.data
    } catch (error) {
        console.log('Sign Up error', error)
        
        throw error
    }
}


// login service

export const login = async (phone) => {
    try {
        const res = await API.post("/auth/login", {phone})

        return res.data
    } catch (error) {
        console.log("Login user error", error)
        
        throw error
    }
}

// get ME service

export const getMe = async () => {
    try {
        const res = await API.get("/auth/me")

        return res.data
    } catch (error) {
        console.log("Get me error", error)
        
        throw error
    }
}

export const logout = async () => {
    try {
        const res = await API.post("/auth/logout")

       res.data.message
    } catch (error) {
        console.log("Log out error", error)
        
        throw error
    }
}