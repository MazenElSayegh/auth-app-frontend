import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../services/auth.service";
import { QuoteService } from "../services/quote.service";
import "../styles/dashboard.css";

const Dashboard = () => {
  const {
    accessToken,
    refreshToken,
    sessionId,
    currentUser,
    logout,
    setAccessToken,
  } = useAuthStore();
  const navigate = useNavigate();
  const isRefreshing = useRef(false);
  const [quote, setQuote] = useState<string | null>(null);

  // Function to check if token is expired
  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // Consider invalid tokens as expired
    }
  };

  // Function to refresh access token
  const refreshAccessToken = async () => {
    if (isRefreshing.current) return;
    isRefreshing.current = true;

    try {
      console.log("Refreshing access token");
      const response = await AuthService.refreshAccessToken();
      setAccessToken(response.accessToken);
    } catch (error) {
      console.error("Failed to refresh token", error);
      handleLogout();
    } finally {
      isRefreshing.current = false;
    }
    return null;
  };

  // Function to log out the user
  const handleLogout = async () => {
    try {
      if (currentUser?.email && sessionId)
        await AuthService.logout(currentUser?.email || "", sessionId);
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      logout(); // Clear auth state
      navigate("/"); // Redirect to login
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

  // Auto handle token expiration
  useEffect(() => {
    const checkTokens = async () => {
      if (!accessToken || isTokenExpired(accessToken)) {
        if (!refreshToken || isTokenExpired(refreshToken)) {
          handleLogout();
        } else {
          await refreshAccessToken();
        }
      }
    };

    checkTokens();
  }, [accessToken]);

  if (!accessToken || !currentUser) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="container mt-5 text-center dashboard-content w-50">
        <h1 className="mb-4">Welcome to the app {currentUser?.name}!</h1>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <h6>
            Try out the guarded endpoint{" "}
            <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
          </h6>
          <button
            className="btn btn-outline-dark fw-bold border border-2 border-dark rounded-pill p-1 mb-2 ms-3"
            onClick={fetchRandomQuote}
          >
            Get moment's quote
          </button>
        </div>
        {quote && <p className="my-2 fst-italic">{quote}</p>}
        <button
          onClick={handleLogout}
          className="btn btn-danger mt-3 rounded-pill"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
