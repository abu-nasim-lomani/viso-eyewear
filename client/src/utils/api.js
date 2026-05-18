import axios from 'axios'
import { useAuthStore } from '../store/authStore'

/**
 * Shared Axios instance (plan §11 utils/api.js).
 * Base URL comes from VITE_API_URL; in dev, Vite proxies /api → :5000.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
