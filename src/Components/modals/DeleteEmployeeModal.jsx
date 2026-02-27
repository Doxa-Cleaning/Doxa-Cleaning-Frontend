function DeleteEmployeeModal({
  selectedEmployeeId,
  setSelectedEmployeeId,
  employees,
  handleDeleteEmployee,
  onClose,
}) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
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
                {employee.name} - {employee.id}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
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
  );
}

export default DeleteEmployeeModal;
