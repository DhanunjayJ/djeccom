import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL;

export async function loginApi(loginData){
    try{
        const response = await axios.post(`${BASE_URL}/user/login`,loginData);
        return response.data;
    }catch (error){
        throw new Error(error.response?.data?.message || 'Failed to Login');
    }
}

export async function signUpApi(singUpData){
    try{
        const response = await axios.post(`${BASE_URL}/user/signup`,singUpData);
        return response.data;
    }catch(error){
        throw new Error(error.response?.data?.message || 'Failed to SignUp');
    }
}

export async function getAllProductsApi(){
    try{
        const response = await axios.get(`${BASE_URL}/product`);
        return response.data;
    }catch (error){
        throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
}

export async function createRazorpayOrderApi(amount){
    try {
        const response = await axios.post(`${BASE_URL}/payment/create-order`,{amount : amount});
        return response.data;
    } catch(error){
        throw new Error(error.response?.data || 'Failed to create Razorpay order');
    }
}

export async function verifyOrderApi(payload){
    try {
    const res = await axios.post(`${BASE_URL}/payment/verify`,payload);
    return res;
    } catch (error){
        throw new Error(error.response?.data || "Payment Verified by order creating failed");
    }
}
