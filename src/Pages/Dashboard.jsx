import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, token, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
  const [showDeleteEmployeeModal, setShowDeleteEmployeeModal] = useState(false);

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
  const [customerSearch, setCustomerSearch] = useState("");
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    street_add1: "",
    street_add2: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
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
        .then((res) => res.json())
        .then((data) => setEmployees(data.employees || []))
        .catch((err) => console.error("Failed to fetch employees:", err));

      fetch("http://localhost:3000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCustomers(data.customers || []))
        .catch((err) => console.error("Failed to fetch customers:", err));
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

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch customers:", response.status, errorData);
        return;
      }
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
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
      let customerId = newJob.customer_id;

      // If admin filled out new customer form, create that customer first
      if (showNewCustomerForm) {
        const customerRes = await fetch("http://localhost:3000/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCustomer),
        });
        if (!customerRes.ok) {
          console.error("Failed to create customer");
          return;
        }

        const customerData = await customerRes.json();
        customerId = customerData.customer.id;
        fetchCustomers();
      }

      // Creates job using whichever customerId we ended up with
      const response = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: newJob.employee_id,
          customer_id: customerId,
          status: "pending",
          scheduled_date: newJob.scheduled_date,
          scheduled_time: newJob.scheduled_time,
          estimated_duration: newJob.estimated_duration || 60,
        }),
      });

      if (response.ok) {
        // Resets everything
        setShowJobModal(false);
        setNewJob({
          employee_id: "",
          customer_id: "",
          scheduled_date: "",
          scheduled_time: "",
          estimated_duration: "",
        });
        setNewCustomer({
          name: "",
          street_add1: "",
          street_add2: "",
          city: "",
          state: "",
          zip_code: "",
          phone: "",
        });
        setShowNewCustomerForm(false);
        setCustomerSearch("");
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

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/employees/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          // Refresh employee list without deleted employees
          console.log("Employee deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting employee:", err);
      }
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/jobs/${selectedJobId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) throw new Error("Failed to delete job");

        // Remove deleted job from local state
        setJobs(jobs.filter((job) => job.id !== selectedJobId));
        setShowDeleteJobModal(false);
        setSelectedJobId(null);
      } catch (err) {
        console.error("Error deleting job:", err);
      }
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
                className="delete-btn"
                onClick={() => setShowDeleteJobModal(true)}
              >
                - Delete Job
              </button>
              <button
                className="create-btn"
                onClick={() => setShowEmployeeModal(true)}
                style={{ background: "var(--green)" }}
              >
                + Add Employee
              </button>
              <button
                className="delete-btn"
                onClick={() => setShowEmployeeModal(true)}
              >
                - Delete Employee
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
                  {new Date(job.scheduled_date).toLocaleDateString()} at{" "}
                  {new Date(
                    `1970-01-01T${job.scheduled_time}`,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
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
              {/* CUSTOMER SELECTION */}
              <div classNAme="form-group">
                <label>Customer </label>
                {!showNewCustomerForm ? (
                  <>
                    <input
                      type="text"
                      placeholder="Search existing customers..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setNewJob({ ...newJob, customer_id: "" });
                      }}
                    />
                    {/* Filtered dropdown */}
                    {customerSearch && (
                      <div
                        style={{
                          border: "2px solid var(--gray-200)",
                          borderRadius: "10px",
                          marginTop: "6px",
                          maxHeight: "160px",
                          overflowY: "auto",
                          background: "white",
                        }}
                      >
                        {customers
                          .filter((c) =>
                            c.name
                              .toLowerCase()
                              .includes(customerSearch.toLowerCase()),
                          )
                          .map((c) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                setNewJob({ ...newJob, customer_id: c.id });
                                setCustomerSearch(c.name);
                              }}
                              style={{
                                padding: "10px 16px",
                                cursor: "pointer",
                                borderBottom: "1px solid var(--gray-100)",
                                background:
                                  newJob.customer_id === c.id
                                    ? "var(--secondary-blue)"
                                    : "white",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background =
                                  "var(--gray-500")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background =
                                  newJob.customer_id === c.id
                                    ? "var(--secondary-blue)"
                                    : "white")
                              }
                            >
                              <p style={{ margin: 0, fontWeight: 600 }}>
                                {c.name}
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "12px",
                                  color: "var(--gray-500)",
                                }}
                              >
                                {c.street_add1}, {c.city}, {c.state}
                              </p>
                            </div>
                          ))}
                        {customers.filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(customerSearch.toLowerCase()),
                        ).length === 0 && (
                          <p
                            style={{
                              padding: "10px 16px",
                              color: "var(--gray-500)",
                              margin: 0,
                            }}
                          >
                            No customers found
                          </p>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCustomerForm(true);
                        setCustomerSearch("");
                        setNewJob({ ...newJob, customer_id: "" });
                      }}
                      style={{
                        marginTop: "8px",
                        background: "none",
                        border: "none",
                        color: "var(--primary-blue)",
                        cursor: "pointer",
                        fontWeight: 600,
                        padding: 0,
                        fontSize: "14px",
                      }}
                    >
                      + New Customer
                    </button>
                  </>
                ) : (
                  // INLINE NEW CUSTOMER FORM
                  <div
                    style={{
                      border: "2px solid var(--primary-blue)",
                      borderRadius: "10px",
                      padding: "16px",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          color: "var(--primary-blue)",
                        }}
                      >
                        New Customer
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setNewJob(false);
                          setShowNewCustomerForm(false);
                          setNewCustomer({
                            name: "",
                            street_add1: "",
                            street_add2: "",
                            city: "",
                            state: "",
                            zip_code: "",
                            phone: "",
                          });
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--gray-500)",
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    {[
                      { label: "Full Name", key: "name", required: true },
                      { label: "Address", key: "street_add1", required: true },
                      {
                        label: "Address Line 2",
                        key: "street_add2",
                        required: false,
                      },
                      { label: "City", key: "city", required: true },
                      {
                        label: "State (2 letters)",
                        key: "state",
                        required: true,
                      },
                      { label: "Zip Code", key: "zip_code", required: true },
                      { label: "Phone", key: "phone", required: true },
                    ].map(({ label, key, required }) => (
                      <div
                        className="form-group"
                        key={key}
                        style={{ marginBottom: "12px" }}
                      >
                        <label>{label}</label>
                        <input
                          type="text"
                          value={newCustomer[key]}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              [key]: e.target.value,
                            })
                          }
                          required={required}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EMPLOYEE, DATE, TIME */}
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

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowJobModal(false);
                    setShowNewCustomerForm(false);
                    setCustomerSearch("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={!showNewCustomerForm && !newJob.customer_id}
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {/* ========== DELETE JOB MODAL ========== */}
      {showDeleteJobModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteJobModal(false)}
          />
          <div className="modal">
            <h2>Delete Job</h2>
            <div className="form-group">
              <label>Select Job to Delete</label>
              <select
                value={selectedJobId || ""} // Bind State
                onChange={(e) => setSelectedJobId(Number(e.target.value))} // Updates state on change
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
                <option value="">Select job...</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.customer_name} - {job.status}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteJobModal(false)}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={handleDeleteJob}
                disabled={!selectedJobId}
              >
                Delete
              </button>
            </div>
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
      {/* ========== DELETE EMPLOYEE MODAL ========== */}
      {showDeleteEmployeeModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteEmployeeModal(false)}
          />
          <div className="modal">
            <h2>Delete Employee</h2>
            <div className="form-group">
              <label>Select Employee to Delete</label>
              <select
                value={selectedEmployeeId || ""} // Bind State
                onChange={(e) => setSelectedEmployeeId(Number(e.target.value))} // Updates state on change
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
                <option value="">Select Employee...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.users.name} - {employee.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteEmployeeModal(false)}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={handleDeleteEmployee}
                disabled={!selectedEmployeeId}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
