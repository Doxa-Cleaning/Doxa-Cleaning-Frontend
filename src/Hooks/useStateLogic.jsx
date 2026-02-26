import { useState } from "react";

const [jobs, setJobs] = useState([]);
const [employees, setEmployees] = useState([]);
const [customers, setCustomers] = useState([]);
const [hasLoaded, setHasLoaded] = useState(false);
const [selectedJobId, setSelectedJobId] = useState(null);
const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

// ---------- Initial data load ----------
if (!hasLoaded) {
  setHasLoaded(true);

  const jobEndpoint =
    user.role === "admin"
      ? "http://localhost:3000/api/jobs"
      : `http://localhost:3000/api/jobs/my-jobs?employee_id=${user.id}`;

  fetch(jobEndpoint, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setJobs(data.jobs || []))
    .catch((err) => console.error("Failed to fetch jobs:", err));

  if (user.role === "admin") {
    fetch("http://localhost:3000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []))
      .catch((err) => console.error("Failed to fetch employees:", err));

    fetch("http://localhost:3000/api/customers", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers || []))
      .catch((err) => console.error("Failed to fetch customers:", err));
  }
}

export default;