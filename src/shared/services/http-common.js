import axios from "axios";
/*
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
* Create an Axios instance with a base URL and JSON content type.
* @type {axios. AxiosInstance}
* */
const http = axios.create({
  baseURL: "https://lostesters-app-service-08e7da98ea3f.herokuapp.com/api/v1",
  headers: { "Content-type": "application/json" },
});


http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;