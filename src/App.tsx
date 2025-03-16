import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const { accessToken } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={accessToken ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={accessToken ? <Dashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default App;
