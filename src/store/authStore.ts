import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  login: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken });
    localStorage.setItem("accessToken", refreshToken);
    set({ refreshToken });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null });
    localStorage.removeItem("refreshToken");
    set({ refreshToken: null });
  },
}));
