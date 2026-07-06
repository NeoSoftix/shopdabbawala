import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Step 2: BaseURL assign karo
const baseURL = isLocal 
  ? "http://127.0.0.1:5000/api" 
  : "https://tiffin-delivery-app-8se9.onrender.com/api";


const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;