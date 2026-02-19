import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    customer_name: "",
    address: "",
    employee_id: "",
  });
  const [employees, setEmployees] = useState([]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Connection error:", err);
    }
  };

  // Fetch jobs when logged in
  const fetchJobs = async () => {
    const token = localStorage.getItem("token");

    const endpoint =
      user.role === "admin"
        ? "http://localhost:3000/api/jobs"
        : `http://localhost:3000/api/jobs/my-jobs?employee_id=${user.id}`;

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleComplete = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/jobs/${jobId}/complete`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        fetchJobs();
      }
    } catch (err) {
      console.error("Failed to complete job:", err);
    }
  };

  const handleCreateJob = async (req, res) => {
    try {
      const response = await fetch("http://localhost:3000/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        setShowModal(false);
        setNewJob({ customer_name: "", address: "", employee_id: "" });
        fetchJobs();
      }
    } catch (err) {
      console.error("Failed to create job:", err);
    }
  };

  const openCreateModal = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
    setShowModal(true);
  };

  // If logged in, show dashboard
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken("");
    setJobs([]);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <div className="logo-large">Doxa Cleaning</div>
          <h1>Doxa Cleaning</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>

        <div className="login-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>

          <div className="test-credentials">
            <p>Test Credentials</p>
            <p>
              <code>admin@doxacleaning.com</code> / <code>admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
