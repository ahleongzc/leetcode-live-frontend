import axios from 'axios';
import { storage } from '@/utils/storage';
import { toast } from 'sonner'
import { LOCAL_STORAGE_SESSION_TOKEN_KEY } from '@/types';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        'Content-Type': 'application/json',
    }
});


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            await storage.remove(LOCAL_STORAGE_SESSION_TOKEN_KEY)
            toast("Unauthorized", {
                description: "Please login again",
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            });
            window.location.hash = '#/login';
        }
        return Promise.reject(error);
    }
);