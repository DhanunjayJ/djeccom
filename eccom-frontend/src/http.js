import axios from 'axios'
import { clearUser, getAccessToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: BASE_URL
});

function collectionData(data, resourceName) {
    if (Array.isArray(data)) {
        return data;
    }
    if (Array.isArray(data?.content)) {
        return data.content;
    }
    throw new Error(`Unexpected ${resourceName} response from the API`);
}

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
        return collectionData(response.data, 'products');
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

function adminApiError(error, fallbackMessage) {
    return new Error(
        error.response?.data?.message
        || error.response?.data?.detail
        || error.response?.data
        || fallbackMessage,
        { cause: error }
    );
}

export async function getAdminProductsApi() {
    try {
        return collectionData((await api.get('/admin/products')).data, 'products');
    } catch (error) {
        throw adminApiError(error, 'Failed to load products');
    }
}

export async function createAdminProductApi(product) {
    try {
        return (await api.post('/admin/products', product)).data;
    } catch (error) {
        throw adminApiError(error, 'Failed to create product');
    }
}

export async function updateAdminProductApi(id, product) {
    try {
        return (await api.put(`/admin/products/${id}`, product)).data;
    } catch (error) {
        throw adminApiError(error, 'Failed to update product');
    }
}

export async function archiveAdminProductApi(id) {
    try {
        return (await api.delete(`/admin/products/${id}`)).data;
    } catch (error) {
        throw adminApiError(error, 'Failed to archive product');
    }
}

export async function restoreAdminProductApi(id) {
    try {
        return (await api.patch(`/admin/products/${id}/restore`)).data;
    } catch (error) {
        throw adminApiError(error, 'Failed to restore product');
    }
}

export async function getAdminUsersApi() {
    try {
        return collectionData((await api.get('/admin/users')).data, 'users');
    } catch (error) {
        throw adminApiError(error, 'Failed to load users');
    }
}

export async function updateUserRoleApi(id, role) {
    try {
        return (await api.patch(`/admin/users/${id}/role`, { role })).data;
    } catch (error) {
        throw adminApiError(error, 'Failed to update role');
    }
}

export async function getAuditLogsApi() {
    try {
        return collectionData((await api.get('/admin/audit-logs')).data, 'audit logs');
    } catch (error) {
        throw adminApiError(error, 'Failed to load audit logs');
    }
}

export async function getStaffOrdersApi() {
    try {
        return collectionData((await api.get('/admin/orders')).data, 'orders');
    } catch (error) {
        throw adminApiError(error, 'Failed to load orders');
    }
}

export async function updateOrderStatusApi(id, status, note = '') {
    try {
        return (await api.patch(`/admin/orders/${id}/status`, { status, note })).data;
    } catch (error) {
        throw adminApiError(error, 'Failed to update order status');
    }
}
