import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { AuthService } from "../services/auth.service";
import { AlertService } from "../services/alert.service";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginData) => {
    try {
      const response = await AuthService.login(data);
      login(
        response.accessToken,
        response.refreshToken,
        response.currentUser,
        response.sessionId
      );
      navigate("/dashboard");
    } catch (error: any) {
      AlertService.error("Login Failed", error.message);
    }
  };

  const onSignupSubmit = async (data: SignupData) => {
    try {
      await AuthService.signup(data);
      navigate("/dashboard");
    } catch (error: any) {
      AlertService.error("Signup Failed", error.message);
    }
  };

  return (
    <div className="login-container vh-100 w-100">
      <div className="w-50 h-100"></div>
      <div className="d-flex justify-content-center align-items-center vh-100 w-50">
        <div className="p-4 rounded w-50 h-100">
          <ul className="nav nav-tabs mt-5">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => setActiveTab("signup")}
              >
                Signup
              </button>
            </li>
          </ul>

          <div className="tab-content mt-5">
            {activeTab === "login" && (
              <form
                onSubmit={handleLoginSubmit(onLoginSubmit)}
                className="d-flex flex-column align-items-center"
              >
                <h1 className="mb-4">Welcome</h1>
                <p className="text-center mb-5">
                  Please log in so you can access the app.
                </p>
                <div className="floating-label w-100">
                  <input
                    {...loginRegister("email")}
                    className=" rounded-pill"
                    placeholder=" "
                    required
                  />
                  <label>Email</label>
                  {loginErrors.email && (
                    <div className="text-danger ms-3 small-font mt-2">
                      {loginErrors.email.message}
                    </div>
                  )}
                </div>
                <div className="floating-label w-100">
                  <input
                    {...loginRegister("password")}
                    type="password"
                    className=" rounded-pill"
                    placeholder=" "
                    required
                  />
                  <label>Password</label>
                  {loginErrors.password && (
                    <div className="text-danger ms-3 small-font mt-2">
                      {loginErrors.password.message}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-50 rounded-pill mt-3"
                >
                  Login
                </button>
              </form>
            )}

            {activeTab === "signup" && (
              <form
                onSubmit={handleSignupSubmit(onSignupSubmit)}
                className="d-flex flex-column align-items-center"
              >
                <h1 className="mb-4">Create Account</h1>
                <p className="text-center mb-5">
                  Please create account so you can continue access the app.
                </p>
                <div className="floating-label w-100">
                  <input
                    {...signupRegister("name")}
                    className="rounded-pill"
                    placeholder=" "
                    required
                  />
                  <label>Name</label>
                  {signupErrors.name && (
                    <div className="text-danger ms-3 small-font mt-2">
                      {signupErrors.name.message}
                    </div>
                  )}
                </div>
                <div className="floating-label w-100">
                  <input
                    {...signupRegister("email")}
                    className="rounded-pill"
                    placeholder=" "
                    required
                  />
                  <label>Email</label>
                  {signupErrors.email && (
                    <div className="text-danger ms-3 small-font mt-2">
                      {signupErrors.email.message}
                    </div>
                  )}
                </div>
                <div className="floating-label w-100">
                  <input
                    {...signupRegister("password")}
                    type="password"
                    className="rounded-pill"
                    placeholder=" "
                    required
                  />
                  <label>Password</label>
                  {signupErrors.password && (
                    <div className="text-danger ms-3 small-font mt-2">
                      {signupErrors.password.message}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-50 rounded-pill mt-3"
                >
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
