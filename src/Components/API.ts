import axios, { AxiosRequestConfig } from "axios"

const api = axios.create({
	baseURL: "http://10.1.4.110:5000/",
  timeout: 5000,
})

export default api;