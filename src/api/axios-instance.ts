import axios from 'axios';
import { HTTP_STATUS } from '@/types';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        'Content-Type': 'application/json',
    }
});

export const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status
    }
    return HTTP_STATUS.INTERNAL_SERVER_ERROR
}
