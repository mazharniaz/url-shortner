import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            localStorage.setItem('accessToken', action.payload.accessToken)
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            localStorage.removeItem('accessToken')
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer