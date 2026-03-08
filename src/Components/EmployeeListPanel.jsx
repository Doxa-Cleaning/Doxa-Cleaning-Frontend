import "../css/EmployeeListPanel.css";

export default function EmployeeListPanel({
  employees,
  jobs,
  setFilterEmployee,
  setShowEmployeeList,
}) {
  return (
    <div className="employee-panel">
      <h3 className="employee-panel__title">All Employees</h3>
      {employees.length === 0 ? (
        <p className="employee-panel__empty">
          No employees yet. Add one with the button above.
        </p>
      ) : (
        <div className="employee-panel__grid">
          {employees.map((emp) => {
            const empJobs = jobs.filter((j) => j.employee_id === emp.id);
            const empPending = empJobs.filter(
              (j) => j.status !== "Completed",
            ).length;
            return (
              <div
                key={emp.id}
                className="employee-card"
                onClick={() => {
                  setFilterEmployee(String(emp.id));
                  setShowEmployeeList(false);
                }}
              >
                <p className="employee-card__name">{emp.name}</p>
                <p classname="employee-card__email">{emp.email}</p>
                {emp.phone && (
                  <p className="employee-card__phone">{emp.phone}</p>
                )}
                <p
                  className={`employee-card__status ${empPending > 0 ? "employee-card__status--active" : "employee-card__status--clear"}`}
                >
                  {empPending} active job{empPending !== 1 ? "s" : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
