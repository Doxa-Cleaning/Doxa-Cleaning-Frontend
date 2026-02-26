import { useState } from "react";

const [jobs, setJobs] = useState([]);
const [employees, setEmployees] = useState([]);
const [customers, setCustomers] = useState([]);
const [hasLoaded, setHasLoaded] = useState(false);
const [selectedJobId, setSelectedJobId] = useState(null);
const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
