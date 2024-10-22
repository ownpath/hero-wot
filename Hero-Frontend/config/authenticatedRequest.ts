import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:8080"; // Replace with your API base URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authenticatedRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosInstance(config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle token expiration
      // You can implement token refresh logic here
      // For now, we'll just clear the token and throw an error
      localStorage.removeItem("accessToken");
      throw new Error("Your session has expired. Please log in again.");
    }
    throw error;
  }
};

export default authenticatedRequest;
