import axios from 'axios';

var Baseurl = import.meta.env.VITE_BASE_URL;

export const basicRequest = axios.create({
    baseURL: Baseurl
})

export const AdminRequest = axios.create({
    baseURL: Baseurl
})

AdminRequest.interceptors.request.use(
    (config) => {
        try {
            var persistLogindata = localStorage.getItem('persist:logindata')
            var Logindata = persistLogindata ? JSON.parse(persistLogindata) : {}
            var loginInfo = Logindata.AdminLogin ? JSON.parse(Logindata.AdminLogin).AdminLoginData[0] : null
            if (loginInfo && loginInfo.Token) {
                config.headers.Authorization = `${loginInfo.Token}`
            }
        } catch (error) {
            console.error("Error in admin interceptor:", error)
        }
        return config
    }
)

export const UserRequest = axios.create({
    baseURL: Baseurl
})

UserRequest.interceptors.request.use(
    (config) => {
        try {
            var persistLogindata = localStorage.getItem('persist:logindata')
            var Logindata = persistLogindata ? JSON.parse(persistLogindata) : {}
            var loginInfo = Logindata.UserLogin ? JSON.parse(Logindata.UserLogin).UserLoginStore : null
            if (loginInfo && loginInfo.Token) {
                config.headers.Authorization = `${loginInfo.Token}`
            }
        } catch (error) {
            console.error("Error in user interceptor:", error)
        }
        return config
    }
)