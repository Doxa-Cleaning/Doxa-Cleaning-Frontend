import { useState, useEffect, useCallback } from "react";
import API_URL from "../config.js";
export default function useDataLogic({ user, token }) {
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // ---------- Fetch Functions ------------
  const fetchJobs = useCallback(() => {
    const jobEndpoint =
      user.role === "admin"
        ? `${API_URL}/api/jobs`
        : `${API_URL}/api/jobs/my-jobs?employee_id=${user.id}`;

    fetch(jobEndpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => console.error("Failed to fetch jobs:", err));
  }, [user.role, user.id, token]);
  const fetchEmployees = useCallback(() => {
    fetch(`${API_URL}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []))
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, [token]);
  const fetchCustomers = useCallback(() => {
    fetch(`${API_URL}/api/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers || []))
      .catch((err) => console.error("Failed to fetch customers:", err));
  }, [token]);

  // ---------- Initial data load ----------
  useEffect(() => {
    fetchJobs();
    if (user.role === "admin") {
      fetchEmployees();
      fetchCustomers();
    }
  }, [fetchJobs, fetchEmployees, fetchCustomers, user.role]);

  return {
    jobs,
    setJobs,
    employees,
    setEmployees,
    customers,
    setCustomers,
    selectedJobId,
    setSelectedJobId,
    selectedEmployeeId,
    setSelectedEmployeeId,
    fetchJobs,
    fetchEmployees,
    fetchCustomers,
  };
}
