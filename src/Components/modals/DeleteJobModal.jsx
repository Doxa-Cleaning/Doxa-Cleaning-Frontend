import { useState } from "react";
{
  /* ========== DELETE JOB MODAL ========== */
}
function deleteJobModal({}) {
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);

  showDeleteJobModal && (
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
  );
}
