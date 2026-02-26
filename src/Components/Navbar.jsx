import { useState } from "react";
import { useNavigate } from "react-router-dom";

function navBar ({}) { 
    return ( <div className="navbar">
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
        <button className="create-btn" onClick={() => setShowJobModal(true)}>
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
)
}
export;