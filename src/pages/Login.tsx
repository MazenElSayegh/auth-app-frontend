import { useState } from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { useSignupForm } from "../hooks/useSignupForm";
import "../styles/auth.css";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState("login");
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    errors: loginErrors,
  } = useLoginForm();
  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    errors: signupErrors,
  } = useSignupForm();

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
                onSubmit={handleLoginSubmit}
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
                onSubmit={handleSignupSubmit}
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
