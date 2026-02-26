import { useState } from "react";

{
  /* ========== CREATE EMPLOYEE MODAL ========== */
}
function createEmployeeModal({}) {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  showEmployeeModal && (
    <>
      <div
        className="modal-overlay"
        onClick={() => setShowEmployeeModal(false)}
      />
      <div className="modal">
        <h2>Add New Employee</h2>
        {employeeError && <div className="error-message">{employeeError}</div>}
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
  );
}
