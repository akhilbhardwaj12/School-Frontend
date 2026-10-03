import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://vercel.com/akhil-37d7/school-web-app/WHnqhSNA1hUnJ8TfCZfpPM9xHMBr',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;