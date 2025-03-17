import { HttpEndPoints } from "../constants/http.endpoints";
import apiClient from "../utils/api.client";

export const AuthService = {
  login: async (data: { email: string; password: string }) => {
    const { email, password } = data;
    const response = await apiClient.post(HttpEndPoints.AuthApi.Login, {
      email,
      password,
    });
    return response.data;
  },

  signup: async (data: { name: string; email: string; password: string }) => {
    const { name, email, password } = data;
    const response = await apiClient.post(HttpEndPoints.AuthApi.Signup, {
      name,
      email,
      password,
    });
    return response.data;
  },

  refreshAccessToken: async () => {
    const response = await apiClient.get(HttpEndPoints.AuthApi.RefreshToken);
    return response.data;
  },

  logout: async (email: string, sessionId: string | null) => {
    await apiClient.post(HttpEndPoints.AuthApi.Logout, { email, sessionId });
  },
};
