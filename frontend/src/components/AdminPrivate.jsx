import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminPrivate( { children } ) {

    // getting data from store
    var adminLoginInfo = useSelector((state) => state.AdminLogin?.AdminLoginData[0])
    console.log("from React-redux data>>", adminLoginInfo);

    if (adminLoginInfo) {
        var Token = adminLoginInfo.Token
        console.log(Token);
    }

    if (!Token) {
        return <Navigate to='/Admin-login' replace/>
    } else {
        return children
    }

}
    export default AdminPrivate