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
    const res = await API.post("/auth/login", data);

    return res.data;
  } catch (error) {
    console.log("Login error", error);
    
    throw error;
  }
};

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

// logout the page 
export const logout = async () => {
    try {
        const res = await API.post("/auth/logout")

       return res.data.message;
    } catch (error) {
        console.log("Log out error", error)
        
        throw error
    }
}

// Send OTP
export const sendOtp = async (data) => {
  try {
    const res = await API.post("/auth/send-otp", data);

    return res.data;
  } catch (error) {
    console.log("Send OTP error", error);

    throw error;
  }
};

// Verify OTP
export const verifyOtp = async (data) => {
  try {
    const res = await API.post("/auth/verify-otp", data);

    return res.data;
  } catch (error) {
    console.log("Verify OTP error", error);

    throw error;
  }
};

// Forgot Password — sends a reset link to the given email
export const forgotPassword = async (data) => {
  try {
    const res = await API.post("/auth/forgot-password", data);

    return res.data;
  } catch (error) {
    console.log("Forgot Password error", error);

    throw error;
  }
};

// Reset Password — uses the token from the emailed reset link
export const resetPassword = async (token, data) => {
  try {
    const res = await API.put(`/auth/reset-password/${token}`, data);

    return res.data;
  } catch (error) {
    console.log("Reset Password error", error);

    throw error;
  }
};

// Change Password — logged-in user changes their own password
export const changePassword = async (data) => {
  try {
    const res = await API.patch("/auth/change-password", data);

    return res.data;
  } catch (error) {
    console.log("Change Password error", error);

    throw error;
  }
};