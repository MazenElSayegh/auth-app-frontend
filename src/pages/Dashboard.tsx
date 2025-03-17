import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HttpEndPoints } from "../constants/http.endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

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
      const response = await axios.get(HttpEndPoints.AuthApi.RefreshToken, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        return response.data.accessToken;
      }
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
      await axios.post(HttpEndPoints.AuthApi.Logout, {
        email: currentUser?.email,
        sessionId,
      });
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      logout(); // Clear auth state
      navigate("/"); // Redirect to login
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get(HttpEndPoints.AuthApi.GetRandomQuote, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setQuote(response.data.quote); // Assuming response.data is a string
      }
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
    <div className="container mt-5 text-center">
      <h1 className="mb-4">Welcome to the app {currentUser?.name}!</h1>
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h6>
          Try out the guarded endpoint{" "}
          <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
        </h6>
        <button
          className="btn btn-outline-success p-1 mb-2 ms-3"
          onClick={fetchRandomQuote}
        >
          Get quote of the moment
        </button>
      </div>
      {quote && <p className="mt-3">{quote}</p>}
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
