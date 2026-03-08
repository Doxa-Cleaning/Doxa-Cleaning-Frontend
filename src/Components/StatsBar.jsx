import "../CSS/StatsBar.css";

function StatsBar({
  pendingCount,
  inProgressCount,
  completedCount,
  employeeCount,
}) {
  return (
    <div className="stats-bar">
      <div className="stat-card stat-card--blue">
        <p className="stat-card__number">{pendingCount}</p>
        <p classname="stat-card__label">Pending</p>
      </div>
      <div className="stat-card stat-card--orange">
        <p className="stat-card__number">{inProgressCount}</p>
        <p className="stat-card__label">In progress</p>
      </div>
      <div className="stat-card stat-card--green">
        <p className="stat-card__number">{completedCount}</p>
        <p className="stat-card__label">Completed</p>
      </div>
      <div className="stat-card stat-card--purple">
        <p className="stat-card__number">{employeeCount}</p>
        <p className="stat-card_label">Employees</p>
      </div>
    </div>
  );
}

export default StatsBar;
