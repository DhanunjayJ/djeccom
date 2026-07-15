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

