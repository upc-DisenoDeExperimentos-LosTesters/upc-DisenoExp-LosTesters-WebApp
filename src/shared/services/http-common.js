import axios from "axios";
/*
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
* Create an Axios instance with a base URL and JSON content type.
* @type {axios. AxiosInstance}
* */
const http = axios.create({
  baseURL: "https://lostesters-app-service-08e7da98ea3f.herokuapp.com/",
  headers: { "Content-type": "application/json" },
});

export default http;
