import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HttpEndPoints } from "../constants/http.endpoints";
import "../styles/auth.css"; // Import the CSS file

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
      const response = await axios.post(HttpEndPoints.AuthApi.Login, data);
      login(response.data.accessToken, response.data.refreshToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const onSignupSubmit = async (data: SignupData) => {
    try {
      await axios.post(HttpEndPoints.AuthApi.Signup, data);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white w-100">
      <div className="bg-white p-4 rounded w-25 h-100">
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
            <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <h1 className="mb-4 text-center">Welcome</h1>
              <p className="text-center mb-5">
                Please log in so you can continue at anytime on any device.
              </p>
              <div className="floating-label">
                <input
                  {...loginRegister("email")}
                  className=" rounded-pill"
                  placeholder=" "
                  required
                />
                <label>Email</label>
                {loginErrors.email && (
                  <div className="text-danger ms-3 small-font">
                    {loginErrors.email.message}
                  </div>
                )}
              </div>
              <div className="floating-label">
                <input
                  {...loginRegister("password")}
                  type="password"
                  className=" rounded-pill"
                  placeholder=" "
                  required
                />
                <label>Password</label>
                {loginErrors.password && (
                  <div className="text-danger ms-3 small-font">
                    {loginErrors.password.message}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
              <h2 className="mb-4 text-center">Create Account</h2>
              <div className="floating-label">
                <input
                  {...signupRegister("name")}
                  className="rounded-pill"
                  placeholder=" "
                  required
                />
                <label>Name</label>
                {signupErrors.name && (
                  <div className="text-danger ms-3 small-font">
                    {signupErrors.name.message}
                  </div>
                )}
              </div>
              <div className="floating-label">
                <input
                  {...signupRegister("email")}
                  className="rounded-pill"
                  placeholder=" "
                  required
                />
                <label>Email</label>
                {signupErrors.email && (
                  <div className="text-danger ms-3 small-font">
                    {signupErrors.email.message}
                  </div>
                )}
              </div>
              <div className="floating-label">
                <input
                  {...signupRegister("password")}
                  type="password"
                  className="rounded-pill"
                  placeholder=" "
                  required
                />
                <label>Password</label>
                {signupErrors.password && (
                  <div className="text-danger ms-3 small-font">
                    {signupErrors.password.message}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
