import axios from 'axios'
import { clearUser, getAccessToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL
});

api.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && getAccessToken()) {
            clearUser();
            window.dispatchEvent(new Event("auth:expired"));
        }
        return Promise.reject(error);
    }
);

export async function loginApi(loginData){
    try{
        const response = await api.post('/user/login',loginData);
        return response.data;
    }catch (error){
        throw new Error(error.response?.data?.message || error.response?.data || 'Failed to Login', { cause: error });
    }
}

export async function signUpApi(singUpData){
    try{
        const response = await api.post('/user/signup',singUpData);
        return response.data;
    }catch(error){
        throw new Error(error.response?.data?.message || error.response?.data || 'Failed to SignUp', { cause: error });
    }
}

export async function getAllProductsApi(){
    try{
        const response = await api.get('/product');
        return response.data;
    }catch (error){
        throw new Error(error.response?.data?.message || error.response?.data || 'Failed to fetch products', { cause: error });
    }
}

export async function createRazorpayOrderApi(amount){
    try {
        const response = await api.post('/payment/create-order',{amount : amount});
        return response.data;
    } catch(error){
        throw new Error(error.response?.data || 'Failed to create Razorpay order', { cause: error });
    }
}

export async function verifyOrderApi(payload){
    try {
    const res = await api.post('/payment/verify',payload);
    return res;
    } catch (error){
        throw new Error(error.response?.data || "Payment Verified by order creating failed", { cause: error });
    }
}

export async function getOrderHistoryApi(){
    try {
        const response = await api.get('/orders/history');
        return response.data;
    }catch (error){
        throw new Error(error.response?.data || "Failed to fetch order history", { cause: error });
    }
}
