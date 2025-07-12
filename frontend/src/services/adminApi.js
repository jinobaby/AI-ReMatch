import { AdminRequest } from '../axios/AxiosCreate';

export const adminApi = async (data) => {
    try {
        var response = await AdminRequest.post('/Admin/Admin-login', data);
        return response;
    } 
    catch (error) {
        console.error("Error in adminApi:", error);
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            throw error.response;
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request
            throw error;
        }
    }
}

