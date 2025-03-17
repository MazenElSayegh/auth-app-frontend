import { HttpEndPoints } from "../constants/http.endpoints";
import apiClient from "../utils/api.client";

export const QuoteService = {
  getRandomQuote: async () => {
    const response = await apiClient.get(HttpEndPoints.AuthApi.GetRandomQuote);
    return response.data;
  },
};
