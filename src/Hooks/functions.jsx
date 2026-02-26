import { useState } from "react";

// Create job form
const [newJob, setNewJob] = useState({
employee_id: "",
customer_id: "",
scheduled_date: "",
scheduled_time: "",
estimated_duration: "",
});
const [customerSearch, setCustomerSearch] = useState("");
const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
const [newCustomer, setNewCustomer] = useState({
name: "",
street_add1: "",
street_add2: "",
city: "",
state: "",
zip_code: "",
phone: "",
});

// Create employee form
const [newEmployee, setNewEmployee] = useState({
name: "",
email: "",
password: "",
phone: "",
});
const [filterEmployee, setFilterEmployee] = useState("");
const [employeeSuccess, setEmployeeSuccess] = useState("");
const [employeeError, setEmployeeError] = useState("");
const navigate = useNavigate();

// ---------- Fetch helpers ----------
const fetchJobs = async () => {
const endpoint =
    user.role === "admin"
    ? "http://localhost:3000/api/jobs"
    : `http://localhost:3000/api/jobs/my-jobs?employee_id=${user.id}`;
    try {
        const response = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setJobs(data.jobs || []);
    } catch (err) {
        console.error("Failed to fetch jobs:", err);
    }
};
const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch employees:", response.status, errorData);
        return;
      }
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
};
const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch customers:", response.status, errorData);
        return;
      }
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
};

// ---------- Actions ----------
const handleComplete = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/jobs/${jobId}/complete`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) fetchJobs();
    } catch (err) {
      console.error("Failed to complete job:", err);
    }
};
const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      let customerId = newJob.customer_id;

      // If admin filled out new customer form, create that customer first
      if (showNewCustomerForm) {
        const customerRes = await fetch("http://localhost:3000/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCustomer),
        });
        if (!customerRes.ok) {
          console.error("Failed to create customer");
          return;
        }

        const customerData = await customerRes.json();
        customerId = customerData.customer.id;
        fetchCustomers();
      }

      // Creates job using whichever customerId we ended up with
      const response = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: newJob.employee_id,
          customer_id: customerId,
          status: "pending",
          scheduled_date: newJob.scheduled_date,
          scheduled_time: newJob.scheduled_time,
          estimated_duration: newJob.estimated_duration || 60,
        }),
      });

      if (response.ok) {
        // Resets everything
        setShowJobModal(false);
        setNewJob({
          employee_id: "",
          customer_id: "",
          scheduled_date: "",
          scheduled_time: "",
          estimated_duration: "",
        });
        setNewCustomer({
          name: "",
          street_add1: "",
          street_add2: "",
          city: "",
          state: "",
          zip_code: "",
          phone: "",
        });
        setShowNewCustomerForm(false);
        setCustomerSearch("");
        fetchJobs();
      }
    } catch (err) {
      console.error("Failed to create job:", err);
    }
};
const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setEmployeeError("");
    setEmployeeSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          password: newEmployee.password,
          phone: newEmployee.phone,
          role: "employee",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmployeeSuccess(`${newEmployee.name} added successfully!`);
        setNewEmployee({ name: "", email: "", password: "", phone: "" });
        fetchEmployees();
        setTimeout(() => {
          setShowEmployeeModal(false);
          setEmployeeSuccess("");
        }, 1500);
      } else {
        setEmployeeError(data.error || "Failed to create employee");
      }
    } catch (err) {
      setEmployeeError("Connection error:", err);
    }
};
const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/employees/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          // Refresh employee list without deleted employees
          console.log("Employee deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting employee:", err);
      }
    }
};
const handleDeleteJob = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/jobs/${selectedJobId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) throw new Error("Failed to delete job");

        // Remove deleted job from local state
        setJobs(jobs.filter((job) => job.id !== selectedJobId));
        setShowDeleteJobModal(false);
        setSelectedJobId(null);
      } catch (err) {
        console.error("Error deleting job:", err);
      }
    }
};
const handleLogout = () => {
    onLogout();
    navigate("/login");
};

// ---------- Filtered jobs ----------
const filteredJobs = user.role === "admin" && filterEmployee
    ? jobs.filter((job) => String(job.employee_id) === filterEmployee)
    : jobs;

// ---------- Stats (admin only) ----------
const pendingCount = jobs.filter((j) => j.status === "pending").length;
const inProgressCount = jobs.filter((j) => j.status === "in-progress").length;
const completedCount = jobs.filter((j) => j.status === "completed").length;


export default;