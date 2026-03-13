import Navbar from "../Components/Navbar.jsx";
import JobCard from "../Components/JobCard.jsx";
import EmployeeFilter from "../Components/EmployeeFilter.jsx";
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
    handleStartJob,
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
      {/* Navbar */}
      <Navbar
        user={user}
        handleLogout={handleLogout}
        setShowJobModal={setShowJobModal}
        setShowDeleteJobModal={setShowDeleteJobModal}
        setShowEmployeeModal={setShowEmployeeModal}
        setShowDeleteEmployeeModal={setShowDeleteEmployeeModal}
        showEmployeeList={showEmployeeList}
        setShowEmployeeList={setShowEmployeeList}
      />
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
        <EmployeeFilter
          employees={employees}
          filterEmployee={filterEmployee}
          setFilterEmployee={setFilterEmployee}
        />
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
      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="jobs-empty">
          <p className="jobs-empty__message">
            {filterEmployee ? "No jobs for this employee" : "No jobs yet"}
          </p>
          {user.role === "admin" && !filterEmployee && (
            <p>Click "+ Create Job" to get started</p>
          )}
          {filterEmployee && (
            <button
              className="btn btn--blue"
              onClick={() => setFilterEmployee("")}
            >
              Show All Jobs
            </button>
          )}
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              user={user}
              handleStartJob={handleStartJob}
              handleComplete={handleComplete}
            />
          ))}
        </div>
      )}
      {/* Modals */}
      {showJobModal && (
        <CreateJobModal
          handleCreateJob={handleCreateJob}
          showNewCustomerForm={showNewCustomerForm}
          customerSearch={customerSearch}
          setCustomerSearch={setCustomerSearch}
          setNewJob={setNewJob}
          newJob={newJob}
          customers={customers}
          employees={employees}
          setShowNewCustomerForm={setShowNewCustomerForm}
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          onClose={() => setShowJobModal(false)}
        />
      )}
      {showDeleteJobModal && (
        <DeleteJobModal
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          jobs={jobs}
          handleDeleteJob={handleDeleteJob}
          onClose={() => setShowDeleteJobModal(false)}
        />
      )}
      {showEmployeeModal && (
        <CreateEmployeeModal
          employeeError={employeeError}
          employeeSuccess={employeeSuccess}
          newEmployee={newEmployee}
          handleCreateEmployee={handleCreateEmployee}
          setNewEmployee={setNewEmployee}
          setEmployeeError={setEmployeeError}
          setEmployeeSuccess={setEmployeeSuccess}
          onClose={() => setShowEmployeeModal(false)}
        />
      )}
      {showDeleteEmployeeModal && (
        <DeleteEmployeeModal
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          employees={employees}
          handleDeleteEmployee={handleDeleteEmployee}
          onClose={() => setShowDeleteEmployeeModal(false)}
        />
      )}
    </div>
  );
}
export default Dashboard;
