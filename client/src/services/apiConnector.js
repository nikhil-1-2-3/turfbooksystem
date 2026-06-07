import axios from "axios";
import { toast } from "react-hot-toast";

export const axiosInstance = axios.create({});

// Add a response interceptor to automatically handle expired tokens
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only trigger auto-logout if the request wasn't for login/signup
            // and the user is not already on the login page
            if (
                !error.config.url.includes("/auth/login") && 
                !error.config.url.includes("/auth/signup") && 
                window.location.pathname !== "/login"
            ) {
                // Clear user session
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                
                // Show a toast message and redirect after a short delay
                toast.error("Session expired. Please log in again.");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            }
        }
        return Promise.reject(error);
    }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: method,
        url: url,
        data: bodyData?bodyData:null,
        headers: headers?headers:null,
        params: params?params:null
    })
};