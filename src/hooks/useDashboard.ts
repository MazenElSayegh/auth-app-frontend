import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import { QuoteService } from "../services/quote.service";

export const useDashboard = () => {
  const { accessToken, sessionId, currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      if (currentUser?.email && sessionId)
        await AuthService.logout(currentUser.email, sessionId);
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      logout();
      navigate("/");
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const response = await QuoteService.getRandomQuote();
      setQuote(response.quote);
    } catch (error) {
      console.error("Failed to fetch quote", error);
      setQuote("Failed to fetch quote. Try again later.");
    }
  };

  return { accessToken, currentUser, quote, fetchRandomQuote, handleLogout };
};
