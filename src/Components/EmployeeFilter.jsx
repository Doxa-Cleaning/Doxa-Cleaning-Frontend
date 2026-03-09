import "../css/EmployeeFilter.css";

export default function EmployeeFilter({
  employees,
  filterEmployee,
  setFilterEmployee,
}) {
  return (
    <div className="employee-filter">
      <select
        className="employee-filter__select"
        value={filterEmployee}
        onChange={(e) => setFilterEmployee(e.target.value)}
      >
        <option value="">All Jobs (All Employees)</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}'s Jobs
          </option>
        ))}
      </select>
    </div>
  );
}
