import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { jwtDecode } from "jwt-decode";
import { HttpEndPoints } from "../constants/http.endpoints";

const apiClient = axios.create({
  baseURL: HttpEndPoints.BaseApi.AuthApi,
  headers: { "Content-Type": "application/json" },
});

// Flag to prevent multiple refresh requests at the same time
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Request Interceptor: Attach Access Token or Refresh Token
apiClient.interceptors.request.use((config) => {
  const { accessToken, refreshToken } = useAuthStore.getState();
  const headerToken = config.url?.includes(HttpEndPoints.AuthApi.RefreshToken)
    ? refreshToken
    : accessToken;
  if (headerToken) {
    config.headers.Authorization = `Bearer ${headerToken}`;
  }
  return config;
});

// Response Interceptor: Handle 401 Errors
apiClient.interceptors.response.use(
  (response) => response, // If response is OK, return it
  async (error) => {
    const originalRequest = error.config;
    const { accessToken, refreshToken, setAccessToken, logout } =
      useAuthStore.getState();

    // If unauthorized and it's the first retry
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      accessToken
    ) {
      if (!refreshToken || isTokenExpired(refreshToken)) {
        logout(); // No refresh token, logout user
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshResponse = await axios.get(
            HttpEndPoints.AuthApi.RefreshToken,
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          );

          if (refreshResponse.status === 200) {
            const newAccessToken = refreshResponse.data.accessToken;
            setAccessToken(newAccessToken);
            onRefreshed(newAccessToken);
          }
        } catch (refreshError) {
          console.error("Refresh token failed", refreshError);
          logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Wait for new token and retry original request
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    // Global Error Handling
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred. Please try again.";

    return Promise.reject({ message: errorMessage });
  }
);

export default apiClient;
