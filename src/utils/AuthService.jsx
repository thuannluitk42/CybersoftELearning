import axios from "axios";

export const api = axios.create({
    baseURL: "https://cybersoftelearningbe-production.up.railway.app/api/auth"
});

export const signInFunction = async (LoginDto) => {
    try {
        const response = await api.post("/signin", LoginDto);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else {
            throw new Error('Network error');
        }
    }
};

export const signUpFunction = async (params) => {
    try {
        const response = await api.post('/signup', params);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else {
            throw new Error('Network error');
        }
    }
};
