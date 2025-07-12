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
            window.location.hash = '#/login';
        }

        if (error.response?.status === 500) {
            window.location.hash = '#/error';
        }

        if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
            toast("Network Error", {
                description: "Unable to connect to the server. Please try again later.",
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            });
            window.location.hash = '#/error';
        }

        return Promise.reject(error);
    }
);