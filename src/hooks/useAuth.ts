import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import { AlertService } from "../services/alert.service";

export const useAuth = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const loginUser = async (data: { email: string; password: string }) => {
    try {
      const response = await AuthService.login(data);
      login(
        response.accessToken,
        response.refreshToken,
        response.currentUser,
        response.sessionId
      );
      AlertService.success("Login successful");
      navigate("/dashboard");
    } catch (error: any) {
      AlertService.error("Login Failed", error.message);
    }
  };

  const signupUser = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await AuthService.signup(data);
      AlertService.success("Signup successful");
      navigate("/dashboard");
    } catch (error: any) {
      AlertService.error("Signup Failed", error.message);
    }
  };

  return { loginUser, signupUser };
};
