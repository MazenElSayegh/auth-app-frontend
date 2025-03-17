import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDashboard } from "../hooks/useDashboard";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { accessToken, currentUser, quote, fetchRandomQuote, handleLogout } =
    useDashboard();

  if (!accessToken || !currentUser) return null;

  return (
    <div className="dashboard-container">
      <div className="container mt-5 text-center dashboard-content w-50">
        <h1 className="mb-4">Welcome to the app {currentUser?.name}!</h1>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <h6>
            Try out the guarded endpoint{" "}
            <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
          </h6>
          <button
            className="btn btn-outline-dark fw-bold border border-2 border-dark rounded-pill p-1 mb-2 ms-3"
            onClick={fetchRandomQuote}
          >
            Get moment's quote
          </button>
        </div>
        {quote && <p className="my-2 fst-italic">{quote}</p>}
        <button
          onClick={handleLogout}
          className="btn btn-danger mt-3 rounded-pill"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
