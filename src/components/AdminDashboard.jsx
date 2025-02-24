import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/users"),
      axios.get("http://localhost:3000/assignments"),
    ])
    .then(([usersResponse, assignmentsResponse]) => {
      setEmployees(usersResponse.data.filter(user => user.role === "employee"));
      setAssignments(assignmentsResponse.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    });
  }, []);

  const handleAssign = (employeeId) => {
    const assignedToIds = selectedAssignments[employeeId] || [];

    if (assignedToIds.length === 0) {
      alert("Please select at least one feedback recipient.");
      return;
    }

    axios.post("http://localhost:3000/assignments", {
      manager_id: 1,
      employee_id: employeeId,
      assigned_to_ids: assignedToIds,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => {
      alert("Feedback recipients assigned successfully!");
      setAssignments([...assignments, ...assignedToIds.map(id => ({
        employee_id: employeeId,
        assigned_to_id: id
      }))]);

      setSelectedAssignments({ ...selectedAssignments, [employeeId]: [] });
    })
    .catch((error) => {
      console.error("Error assigning employees:", error.response?.data || error.message);
      alert(`Error assigning employees: ${error.response?.data?.error || "Unknown error"}`);
    });
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>Employee Feedback System</h1>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "/";
        }}>Logout</button>
      </header>

      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        {loading ? (
          <p className="loading-text">Loading data...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="dashboard-content">
            {/* Assign Feedback Table (Left Side) */}
            <div className="assign-feedback">
              <h2>Assign Feedback Recipients</h2>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Feedback Assignee</th>
                      <th>Select Feedback Recipients</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>
                          <select
                            multiple
                            className="dropdown"
                            value={selectedAssignments[employee.id] || []}
                            onChange={(e) => {
                              setSelectedAssignments({
                                ...selectedAssignments,
                                [employee.id]: [...e.target.selectedOptions].map(option => option.value)
                              });
                            }}
                          >
                            {employees.filter(e => e.id !== employee.id).map(e => (
                              <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="button" onClick={() => handleAssign(employee.id)}>Assign</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feedback Assignments Table (Right Side) */}
            <div className="feedback-status">
              <h2>Feedback Assignments & Status</h2>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Feedback Assignee</th>
                      <th>Feedback Recipients</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(employee => {
                      const assignedRecipients = assignments.filter(a => a.employee_id === employee.id);
                      return (
                        <tr key={employee.id}>
                          <td>{employee.name}</td>
                          <td>{assignedRecipients.length > 0 
                            ? assignedRecipients.map(a => employees.find(e => e.id === a.assigned_to_id)?.name).join(", ")
                            : "No recipients assigned yet"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
