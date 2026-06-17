import { createSlice } from "@reduxjs/toolkit"

const token = localStorage.getItem("token")

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: token || null, 
        role: null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.role = action.payload.role
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.role = null
            localStorage.removeItem("token")
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer