import "../css/Navbar.css";

export default function NavBar({
  user,
  handleLogout,
  setShowJobModal,
  setShowDeleteJobModal,
  setShowEmployeeModal,
  setShowDeleteEmployeeModal,
  showEmployeeList,
  setShowEmployeeList,
}) {
  return (
    <div className="navbar">
      <div className="navbar__brand">
        <h2 className="navbar__title">Doxa Cleaning</h2>
        <p className="navbar__subtitle">
          {user.role === "admin" ? "Admin Dashboard" : "My Jobs"} — Welcome,{" "}
          {user.name}
        </p>
      </div>
      <div className="navbar__actions">
        {user.role === "admin" && (
          <>
            <button
              className="btn btn--blue"
              onClick={() => setShowJobModal(true)}
            >
              + Create Job
            </button>
            <button
              className="btn btn--red"
              onClick={() => setShowDeleteJobModal(true)}
            >
              - Delete Job
            </button>
            <button
              className="btn btn--green"
              onClick={() => setShowEmployeeModal(true)}
            >
              + Add Employee
            </button>
            <button
              className="btn btn--red"
              onClick={() => setShowDeleteEmployeeModal(true)}
            >
              - Delete Employee
            </button>
            <button
              className="btn btn--purple"
              onClick={() => setShowEmployeeList(!showEmployeeList)}
            >
              Employees
            </button>
          </>
        )}
        <button className="btn btn--outline" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
