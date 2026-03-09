import "../css/JobCard.css";

export default function JobCard({ job, user, handleComplete }) {
  return (
    <div
      className={`job-card ${job.status === "completed" ? "completed" : ""}`}
    >
      <h3 className="job-card__customer">{job.customer_name}</h3>
      {job.street_add1 && (
        <p className="job-card__address">
          {job.street_add1}, {job.city}, {job.state}
        </p>
      )}
      {job.customer_phone && (
        <p className="job-card__phone">Phone: {job.customer_phone}</p>
      )}
      {job.employee_name && (
        <p className="job-card__employee">Assigned to: {job.employee_name}</p>
      )}
      {job.scheduled_date && (
        <p className="job-card__schedule">
          {new Date(job.scheduled_date).toLocaleDateString()} at{" "}
          {new Date(`1970-01-01T${job.scheduled_time}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      )}
      <span className={`status-badge ${job.status}`}>{job.status}</span>
      {user.role === "employee" && job.status !== "completed" && (
        <button className="complete-btn" onClick={() => handleComplete(job.id)}>
          Mark Complete
        </button>
      )}
    </div>
  );
}
