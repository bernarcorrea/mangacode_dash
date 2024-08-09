import axios from "axios";

const Api = axios.create({
    baseURL: "http://localhost/mangacode/mangacode/backend/public/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

Api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default Api;
