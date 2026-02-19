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
        setToken(data.token);
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

  const handleCreateJob = async (e) => {
    e.preventDefault();
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

  if (isLoggedIn) {
    return (
      <div className="dashboard">
        <div className="navbar">
          <div>
            <h2 style={{ margin: 0 }}>Doxa Cleaning</h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              {user.role === "admin" ? "Admin Dashboard" : "My Jobs"}- Welcome,
              {""}
              {user.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {user.role === "admin" && (
              <button className="create-btn" onClick={openCreateModal}>
                + Create Job
              </button>
            )}
            <button
              className="cancel-btn"
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
