export default function EditJobModal({
  editingJob,
  setEditingJob,
  handleEditJob,
  employees,
  onClose,
}) {
  if (!editingJob) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <h2>Edit Job</h2>
        <form onSubmit={handleEditJob}>
          <div className="form-group">
            <label>Assign to Employee</label>
            <select
              value={editingJob.employee_id}
              onChange={(e) =>
                setEditingJob({ ...editingJob, employee_id: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid var(--gray-200)",
                borderRadius: "10px",
                fontSize: "15px",
                backgroundColor: "var(--gray-50)",
              }}
            >
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
              value={editingJob.scheduled_date?.slice(0, 10)}
              onChange={(e) =>
                setEditingJob({ ...editingJob, scheduled_date: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Scheduled Time</label>
            <input
              type="time"
              value={editingJob.scheduled_time?.slice(0, 5)}
              onChange={(e) =>
                setEditingJob({ ...editingJob, scheduled_time: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={editingJob.status}
              onChange={(e) =>
                setEditingJob({ ...editingJob, status: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid var(--gray-200)",
                borderRadius: "10px",
                fontSize: "15px",
                backgroundColor: "var(--gray-50)",
              }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={editingJob.notes || ""}
              onChange={(e) =>
                setEditingJob({ ...editingJob, notes: e.target.value })
              }
              placeholder="Add any notes here..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid var(--gray-200)",
                borderRadius: "10px",
                fontSize: "15px",
                backgroundColor: "var(--gray-50)",
                resize: "vertical",
              }}
            />
          </div>
          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
