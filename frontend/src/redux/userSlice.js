import { createSlice } from '@reduxjs/toolkit';

var UserLoginSlice = createSlice({
    name: 'userLogin',
    initialState: {
        UserLoginStore: null
    },
    reducers: {
        userLoginData: (state, action) => {
            state.UserLoginStore = action.payload;
        },
        clearUserLogin: (state) => {
            state.UserLoginStore = null;
        }
    }
})

export const { userLoginData, clearUserLogin } = UserLoginSlice.actions;
export default UserLoginSlice.reducer;