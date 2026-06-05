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

export const login = async (data) => {
    try {
        const res = await API.post("/auth/login", data)

        return res.data
    } catch (error) {
        console.log("Login user error", error)
        
        throw error
    }
}