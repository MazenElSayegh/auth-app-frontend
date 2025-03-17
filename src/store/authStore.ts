import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: { email: string; name: string } | null;
  sessionId: string | null;
  login: (
    accessToken: string,
    refreshToken: string,
    currentUser: { email: string; name: string },
    sessionId: string
  ) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
};

// Helper function to safely parse JSON from localStorage
const getStoredUser = (): { email: string; name: string } | null => {
  try {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing currentUser from localStorage:", error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: getStoredUser(),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  sessionId: localStorage.getItem("sessionId"),

  login: (accessToken, refreshToken, currentUser, sessionId) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("sessionId", sessionId);

    set({ accessToken, refreshToken, currentUser, sessionId });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("sessionId");

    set({
      accessToken: null,
      refreshToken: null,
      currentUser: null,
      sessionId: null,
    });
  },
  setAccessToken: (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken });
  },
}));
