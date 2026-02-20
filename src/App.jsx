import { useState } from "react";
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
    employee_id: "",
    customer_id: "",
    status: "",
    scheduled_date: "",
    scheduled_time: "",
    estimated_duration: "",
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

        const jobEndpoint =
          data.user.role === "admin"
            ? "http://localhost:3000/api/jobs"
            : `http://localhost:3000/api/jobs/my-jobs?employee_id=${data.user.id}`;

        const jobRes = await fetch(jobEndpoint, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const jobData = await jobRes.json();
        setJobs(jobData.jobs || []);
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
      const response = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: newJob.employee_id,
          customer_id: newJob.customer_id,
          status: "pending",
          scheduled_date: newJob.scheduled_date,
          scheduled_time: newJob.scheduled_time,
          estimated_duration: newJob.estimated_duration || 60,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setNewJob({
          employee_id: "",
          customer_id: "",
          scheduled_date: "",
          scheduled_time: "",
          estimated_duration: "",
        });
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
        {jobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "var(--gray-500)",
            }}
          >
            <p style={{ fontSize: "18px" }}>No jobs yet</p>
            {user.role === "admin" && (
              <p>Click "+ Create Job" to get started</p>
            )}
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`job-card ${job.status === "completed" ? "completed" : ""}`}
              >
                <h3>{job.customer_name}</h3>
                <p>
                  {job.street_add1 &&
                    `${job.street_add1}, ${job.city}, ${job.state}`}
                </p>
                {job.customer_phone && <p>Phone: {job.customer_phone}</p>}
                {job.employee_name && <p>Assigned to: {job.employee_name}</p>}
                {job.scheduled_date && (
                  <p>
                    Date: {new Date(job.scheduled_date).toLocaleDateString()} at{" "}
                    {job.scheduled_time}
                  </p>
                )}
                <span className={`status-badge ${job.status}`}>
                  {job.status}
                </span>
                {user.role !== "admin" && job.status !== "completed" && (
                  <button
                    className="complete-btn"
                    onClick={() => handleComplete(job.id)}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Create Job Modal */}
        {showModal && (
          <>
            <div
              className="modal-overlay"
              onClick={() => setShowModal(false)}
            />
            <div className="modal">
              <h2>Create New Job</h2>
              <form onSubmit={handleCreateJob}>
                <div className="form-group">
                  <label>Customer ID</label>
                  <input
                    type="number"
                    value={newJob.customer_id}
                    onChange={(e) =>
                      setNewJob({ ...newJob, customer_id: e.target.value })
                    }
                    placeholder="Enter customer ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Scheduled Date</label>
                  <input
                    type="date"
                    value={newJob.scheduled_date}
                    onChange={(e) =>
                      setNewJob({ ...newJob, scheduled_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Scheduled Time</label>
                  <input
                    type="time"
                    value={newJob.scheduled_time}
                    onChange={(e) =>
                      setNewJob({ ...newJob, scheduled_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Assign to Employee</label>
                  <select
                    value={newJob.employee_id}
                    onChange={(e) =>
                      setNewJob({ ...newJob, employee_id: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid var(--gray-200)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      backgroundColor: "var(--gray-50)",
                    }}
                  >
                    <option value="">Select employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <div className="logo-large">D</div>
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
