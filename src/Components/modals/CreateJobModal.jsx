function CreateJobModal({
  handleCreateJob,
  showNewCustomerForm,
  customerSearch,
  setCustomerSearch,
  setNewJob,
  newJob,
  customers,
  employees,
  setShowNewCustomerForm,
  newCustomer,
  setNewCustomer,
  onClose,
}) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <h2>Create New Job</h2>
        <form onSubmit={handleCreateJob}>
          {/* CUSTOMER SELECTION */}
          <div className="form-group">
            <label>Customer </label>
            {!showNewCustomerForm ? (
              <>
                <input
                  type="text"
                  placeholder="Search existing customers..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setNewJob({ ...newJob, customer_id: "" });
                  }}
                />
                {/* Filtered dropdown */}
                {customerSearch && (
                  <div
                    style={{
                      border: "2px solid var(--gray-200)",
                      borderRadius: "10px",
                      marginTop: "6px",
                      maxHeight: "160px",
                      overflowY: "auto",
                      background: "white",
                    }}
                  >
                    {customers
                      .filter((c) =>
                        c.name
                          .toLowerCase()
                          .includes(customerSearch.toLowerCase()),
                      )
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setNewJob({ ...newJob, customer_id: c.id });
                            setCustomerSearch(c.name);
                          }}
                          style={{
                            padding: "10px 16px",
                            cursor: "pointer",
                            borderBottom: "1px solid var(--gray-100)",
                            background:
                              newJob.customer_id === c.id
                                ? "var(--secondary-blue)"
                                : "white",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background =
                              "var(--gray-500")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background =
                              newJob.customer_id === c.id
                                ? "var(--secondary-blue)"
                                : "white")
                          }
                        >
                          <p style={{ margin: 0, fontWeight: 600 }}>{c.name}</p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              color: "var(--gray-500)",
                            }}
                          >
                            {c.street_add1}, {c.city}, {c.state}
                          </p>
                        </div>
                      ))}
                    {customers.filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(customerSearch.toLowerCase()),
                    ).length === 0 && (
                      <p
                        style={{
                          padding: "10px 16px",
                          color: "var(--gray-500)",
                          margin: 0,
                        }}
                      >
                        No customers found
                      </p>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCustomerForm(true);
                    setCustomerSearch("");
                    setNewJob({ ...newJob, customer_id: "" });
                  }}
                  style={{
                    marginTop: "8px",
                    background: "none",
                    border: "none",
                    color: "var(--primary-blue)",
                    cursor: "pointer",
                    fontWeight: 600,
                    padding: 0,
                    fontSize: "14px",
                  }}
                >
                  + New Customer
                </button>
              </>
            ) : (
              // INLINE NEW CUSTOMER FORM
              <div
                style={{
                  border: "2px solid var(--primary-blue)",
                  borderRadius: "10px",
                  padding: "16px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      color: "var(--primary-blue)",
                    }}
                  >
                    New Customer
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCustomerForm(false);
                      onClose();
                      setNewCustomer({
                        name: "",
                        street_add1: "",
                        street_add2: "",
                        city: "",
                        state: "",
                        zip_code: "",
                        phone: "",
                      });
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--gray-500)",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {[
                  { label: "Full Name", key: "name", required: true },
                  { label: "Address", key: "street_add1", required: true },
                  {
                    label: "Address Line 2",
                    key: "street_add2",
                    required: false,
                  },
                  { label: "City", key: "city", required: true },
                  {
                    label: "State (2 letters)",
                    key: "state",
                    required: true,
                  },
                  { label: "Zip Code", key: "zip_code", required: true },
                  { label: "Phone", key: "phone", required: true },
                ].map(({ label, key, required }) => (
                  <div
                    className="form-group"
                    key={key}
                    style={{ marginBottom: "12px" }}
                  >
                    <label>{label}</label>
                    <input
                      type="text"
                      value={newCustomer[key]}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          [key]: e.target.value,
                        })
                      }
                      required={required}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EMPLOYEE, DATE, TIME */}
          <div className="form-group">
            <label>Assign to Employee</label>
            <select
              value={newJob.employee_id}
              onChange={(e) =>
                setNewJob({ ...newJob, employee_id: e.target.value })
              }
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
              <option value="">Select employee...</option>
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
              value={newJob.scheduled_date}
              onChange={(e) =>
                setNewJob({ ...newJob, scheduled_date: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Scheduled Time</label>
            <input
              type="time"
              value={newJob.scheduled_time}
              onChange={(e) =>
                setNewJob({ ...newJob, scheduled_time: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowNewCustomerForm(false);
                setCustomerSearch("");
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={!showNewCustomerForm && !newJob.customer_id}
            >
              Create Job
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateJobModal;
