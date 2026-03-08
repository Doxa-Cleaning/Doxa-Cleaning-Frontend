import Navbar from "../Components/Navbar.jsx";
import CreateJobModal from "../Components/modals/CreateJobModal.jsx";
import DeleteJobModal from "../Components/modals/DeleteJobModal.jsx";
import CreateEmployeeModal from "../Components/modals/CreateEmployeeModal.jsx";
import DeleteEmployeeModal from "../Components/modals/DeleteEmployeeModal.jsx";
import EmployeeListPanel from "../Components/EmployeeListPanel.jsx";
import useDataLogic from "../Hooks/useDataLogic.jsx";
import useModals from "../Hooks/useModals.js";
import useFunctionLogic from "../Hooks/useFunctionLogic.jsx";
import StatsBar from "../Components/StatsBar.jsx";

function Dashboard({ user, token, onLogout }) {
  const {
    jobs,
    setJobs,
    employees,
    setEmployees,
    customers,
    setCustomers,
    selectedJobId,
    setSelectedJobId,
    selectedEmployeeId,
    setSelectedEmployeeId,
    fetchJobs,
    fetchEmployees,
    fetchCustomers,
  } = useDataLogic({ user, token });

  const {
    showJobModal,
    setShowJobModal,
    showDeleteJobModal,
    setShowDeleteJobModal,
    showEmployeeModal,
    setShowEmployeeModal,
    showDeleteEmployeeModal,
    setShowDeleteEmployeeModal,
    showEmployeeList,
    setShowEmployeeList,
  } = useModals();

  const {
    pendingCount,
    inProgressCount,
    completedCount,
    filteredJobs,
    filterEmployee,
    setFilterEmployee,
    handleComplete,
    handleCreateJob,
    handleCreateEmployee,
    handleDeleteEmployee,
    handleDeleteJob,
    handleLogout,
    newJob,
    setNewJob,
    customerSearch,
    setCustomerSearch,
    showNewCustomerForm,
    setShowNewCustomerForm,
    newCustomer,
    setNewCustomer,
    newEmployee,
    setNewEmployee,
    employeeError,
    setEmployeeError,
    employeeSuccess,
    setEmployeeSuccess,
  } = useFunctionLogic({
    user,
    token,
    onLogout,
    jobs,
    setJobs,
    employees,
    setEmployees,
    customers,
    setCustomers,
    selectedJobId,
    setSelectedJobId,
    fetchJobs,
    fetchEmployees,
    fetchCustomers,
    setShowJobModal,
    setShowEmployeeModal,
    setShowDeleteJobModal,
  });

  return (
    <div className="dashboard">
      {/* Admin Stats Bar */}
      {user.role === "admin" && (
        <StatsBar
          pendingCount={pendingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          employeeCount={employees.length}
        />
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
        <EmployeeListPanel
          employees={employees}
          jobs={jobs}
          setFilterEmployee={setFilterEmployee}
          setShowEmployeeList={setShowEmployeeList}
        />
      )}
    </div>
  );
}
{
  /* Jobs Grid */
}
{
  filteredJobs.length === 0 ? (
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
            {job.street_add1 && `${job.street_add1}, ${job.city}, ${job.state}`}
          </p>
          {job.customer_phone && <p>Phone: {job.customer_phone}</p>}
          {job.employee_name && <p>Assigned to: {job.employee_name}</p>}
          {job.scheduled_date && (
            <p>
              {new Date(job.scheduled_date).toLocaleDateString()} at{" "}
              {new Date(`1970-01-01T${job.scheduled_time}`).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                },
              )}
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
  );
}

export default Dashboard;
