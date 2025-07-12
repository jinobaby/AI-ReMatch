import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function UserPrivate( { children } ) {

    // getting data from store
    var UserLoginInfo = useSelector((state) => state.UserLogin?.UserLoginStore)
    console.log("from React-redux data>>", UserLoginInfo);

    if (UserLoginInfo) {
        var Token = UserLoginInfo.Token
    }

    if (!Token) {
        return <Navigate to='/login' replace/>
    } else {
        return children
    }

}
    export default UserPrivate