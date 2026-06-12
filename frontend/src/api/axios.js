import axios from "axios";
import { store } from "../app/store";
import { logout, setCredentials } from '../features/auth/authSlice'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config
        if(error.response?.status == 401 && !original._retry) {
            original._retry = true
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, {
                    withCredentials: true
                })
                const newToken = res.data.accessToken
                store.dispatch(setCredentials({ accessToken: newToken }))
                original.headers.Authorization = `Bearer ${token}`
                return api(original)
            } catch {
                store.dispatch(logout())
            }
        }
        return Promise.reject(error)
    }
)

export default api