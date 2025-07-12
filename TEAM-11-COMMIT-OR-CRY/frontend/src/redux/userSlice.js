import { createSlice } from '@reduxjs/toolkit';

var UserLoginSlice = createSlice({
    name: 'userLogin',
    initialState: {
        UserLoginStore: null,
        userRole: null
    },
    reducers: {
        userLoginData: (state, action) => {
            state.UserLoginStore = action.payload;
        },
        clearUserLogin: (state) => {
            state.UserLoginStore = null;
            state.userRole = null;
        },
        setUserRole: (state, action) => {
            state.userRole = action.payload;
        }
    }
})

export const { userLoginData, clearUserLogin, setUserRole } = UserLoginSlice.actions;
export default UserLoginSlice.reducer;