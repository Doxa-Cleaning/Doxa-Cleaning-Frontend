import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, token, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  // Filter
  const [filterEmployee, setFilterEmployee] = useState("");

  // Create job form
  const [newJob, setNewJob] = useState({
    employee_id: "",
    customer_id: "",
    scheduled_date: "",
    scheduled_time: "",
    estimated_duration: "",
  });

  // Create employee form
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [employeeSuccess, setEmployeeSuccess] = useState("");
  const [employeeError, setEmployeeError] = useState("");

  const navigate = useNavigate();

  // ---------- Initial data load ----------
  if (!hasLoaded) {
    setHasLoaded(true);

    const jobEndpoint =
      user.role === "admin"
        ? "http://localhost:3000/api/jobs"
        : `http://localhost:3000/api/jobs/my-jobs?employee_id=${user.id}`;

    fetch(jobEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => console.error("Failed to fetch jobs:", err));

    if (user.role === "admin") {
      fetch("http://localhost:3000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch employees: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setEmployees(data.employees || []))
        .catch((err) => console.error("Failed to fetch employees:", err));
    }
  }

  // ---------- Fetch helpers ----------
  const fetchJobs = async () => {
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

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch employees:", response.status, errorData);
        return;
      }
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  // ---------- Actions ----------
  const handleComplete = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/jobs/${jobId}/complete`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) fetchJobs();
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
        setShowJobModal(false);
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

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setEmployeeError("");
    setEmployeeSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          password: newEmployee.password,
          phone: newEmployee.phone,
          role: "employee",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmployeeSuccess(`${newEmployee.name} added successfully!`);
        setNewEmployee({ name: "", email: "", password: "", phone: "" });
        fetchEmployees();
        setTimeout(() => {
          setShowEmployeeModal(false);
          setEmployeeSuccess("");
        }, 1500);
      } else {
        setEmployeeError(data.error || "Failed to create employee");
      }
    } catch (err) {
      setEmployeeError("Connection error:", err);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  // ---------- Filtered jobs ----------
  const filteredJobs =
    user.role === "admin" && filterEmployee
      ? jobs.filter((job) => String(job.employee_id) === filterEmployee)
      : jobs;

  // ---------- Stats (admin only) ----------
  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const inProgressCount = jobs.filter((j) => j.status === "in-progress").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="navbar">
        <div>
          <h2 style={{ margin: 0 }}>Doxa Cleaning</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            {user.role === "admin" ? "Admin Dashboard" : "My Jobs"} — Welcome,{" "}
            {user.name}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {user.role === "admin" && (
            <>
              <button
                className="create-btn"
                onClick={() => setShowJobModal(true)}
              >
                + Create Job
              </button>
              <button
                className="create-btn"
                onClick={() => setShowEmployeeModal(true)}
                style={{ background: "var(--green)" }}
              >
                + Add Employee
              </button>
              <button
                className="create-btn"
                onClick={() => setShowEmployeeList(!showEmployeeList)}
                style={{ background: "var(--purple)" }}
              >
                Employees
              </button>
            </>
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

      {/* Admin Stats Bar */}
      {user.role === "admin" && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "140px",
              background: "var(--secondary-blue)",
              padding: "16px 20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--primary-blue)",
                margin: 0,
              }}
            >
              {pendingCount}
            </p>
            <p
              style={{ fontSize: "13px", color: "var(--gray-600)", margin: 0 }}
            >
              Pending
            </p>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: "140px",
              background: "var(--orange-light)",
              padding: "16px 20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--orange)",
                margin: 0,
              }}
            >
              {inProgressCount}
            </p>
            <p
              style={{ fontSize: "13px", color: "var(--gray-600)", margin: 0 }}
            >
              In Progress
            </p>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: "140px",
              background: "var(--green-light)",
              padding: "16px 20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--green)",
                margin: 0,
              }}
            >
              {completedCount}
            </p>
            <p
              style={{ fontSize: "13px", color: "var(--gray-600)", margin: 0 }}
            >
              Completed
            </p>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: "140px",
              background: "var(--purple-light)",
              padding: "16px 20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--purple)",
                margin: 0,
              }}
            >
              {employees.length}
            </p>
            <p
              style={{ fontSize: "13px", color: "var(--gray-600)", margin: 0 }}
            >
              Employees
            </p>
          </div>
        </div>
      )}

      {/* Employee Filter (admin only) */}
      {user.role === "admin" && employees.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            style={{
              padding: "10px 16px",
              border: "2px solid var(--gray-200)",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: "white",
              minWidth: "220px",
            }}
          >
            <option value="">All Jobs (All Employees)</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}'s Jobs
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Employee List Panel */}
      {showEmployeeList && user.role === "admin" && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>All Employees</h3>
          {employees.length === 0 ? (
            <p style={{ color: "var(--gray-500)" }}>
              No employees yet. Add one with the button above.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "12px",
              }}
            >
              {employees.map((emp) => {
                const empJobs = jobs.filter((j) => j.employee_id === emp.id);
                const empPending = empJobs.filter(
                  (j) => j.status !== "completed",
                ).length;
                return (
                  <div
                    key={emp.id}
                    style={{
                      padding: "16px",
                      border: "2px solid var(--gray-200)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onClick={() => {
                      setFilterEmployee(String(emp.id));
                      setShowEmployeeList(false);
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--primary-blue)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.borderColor = "var(--gray-200)")
                    }
                  >
                    <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>
                      {emp.name}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--gray-500)",
                        margin: "0 0 2px 0",
                      }}
                    >
                      {emp.email}
                    </p>
                    {emp.phone && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--gray-500)",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {emp.phone}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color:
                          empPending > 0 ? "var(--orange)" : "var(--green)",
                        margin: 0,
                      }}
                    >
                      {empPending} active job{empPending !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "var(--gray-500)",
          }}
        >
          <p style={{ fontSize: "18px" }}>
            {filterEmployee ? "No jobs for this employee" : "No jobs yet"}
          </p>
          {user.role === "admin" && !filterEmployee && (
            <p>Click "+ Create Job" to get started</p>
          )}
          {filterEmployee && (
            <button
              onClick={() => setFilterEmployee("")}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "var(--primary-blue)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Show All Jobs
            </button>
          )}
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
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
              <span className={`status-badge ${job.status}`}>{job.status}</span>
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

      {/* ========== CREATE JOB MODAL ========== */}
      {showJobModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowJobModal(false)}
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
                  onClick={() => setShowJobModal(false)}
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

      {/* ========== CREATE EMPLOYEE MODAL ========== */}
      {showEmployeeModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowEmployeeModal(false)}
          />
          <div className="modal">
            <h2>Add New Employee</h2>
            {employeeError && (
              <div className="error-message">{employeeError}</div>
            )}
            {employeeSuccess && (
              <div
                style={{
                  background: "var(--green-light)",
                  borderLeft: "4px solid var(--green)",
                  color: "#065f46",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                {employeeSuccess}
              </div>
            )}
            <form onSubmit={handleCreateEmployee}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  placeholder="John Smith"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  placeholder="john@doxacleaning.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                  placeholder="555-0123"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                  placeholder="Temporary password"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowEmployeeModal(false);
                    setEmployeeError("");
                    setEmployeeSuccess("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  style={{ background: "var(--green)" }}
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
export default Dashboard;
