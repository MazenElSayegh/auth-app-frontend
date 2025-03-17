import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { HttpEndPoints } from "../constants/http.endpoints";
import "../styles/auth.css";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
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
      const response = await axios.post(HttpEndPoints.AuthApi.Login, data);

      if (response.status === 200) {
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.currentUser,
          response.data.sessionId
        );
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login failed", error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid credentials, please try again.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        width: "300px",
      });
    }
  };

  const onSignupSubmit = async (data: SignupData) => {
    try {
      const response = await axios.post(HttpEndPoints.AuthApi.Signup, data);
      if (response.status === 201) {
        navigate("/dashboard");
      } else {
        throw new Error("Signup failed");
      }
    } catch (error: any) {
      console.error("Signup failed", error);

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong, please try again.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        width: "300px",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white w-100">
      <div className="w-50 h-100">
        <img
          src="./src/assets/login.jpg"
          alt="Login"
          className="w-100 h-100 object-fit-cover"
        />
      </div>
      <div className="d-flex justify-content-center align-items-center vh-100 w-50">
        <div className="bg-white p-4 rounded w-50 h-100">
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
                    <div className="text-danger ms-3 small-font">
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
                    <div className="text-danger ms-3 small-font">
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
                    <div className="text-danger ms-3 small-font">
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
                    <div className="text-danger ms-3 small-font">
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
                    <div className="text-danger ms-3 small-font">
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
