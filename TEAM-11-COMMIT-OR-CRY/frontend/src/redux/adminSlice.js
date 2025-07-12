import { createSlice } from '@reduxjs/toolkit';

var AdminLoginSlice = createSlice({
    name : 'adminLogin',
    initialState: {
        AdminLoginData: []
    },
    reducers: {
        AdminLoginFun: (state, action) => {
            state.AdminLoginData.push(action.payload);
        },
        AdminLogoutFun: (state) => {
            state.AdminLoginData = []
        }
    }
})

export const { AdminLoginFun, AdminLogoutFun } = AdminLoginSlice.actions;
export default AdminLoginSlice.reducer;