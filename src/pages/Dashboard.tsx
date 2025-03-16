import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!accessToken) {
    navigate("/");
    return null;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dashboard</h1>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="btn btn-danger"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
