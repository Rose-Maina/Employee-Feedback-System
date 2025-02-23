
import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/users"),
      axios.get("http://localhost:3000/assignments"),
      axios.get("http://localhost:3000/feedbacks"),
    ])
    .then(([usersResponse, assignmentsResponse, feedbacksResponse]) => {
      setEmployees(usersResponse.data);
      setAssignments(assignmentsResponse.data);
      setFeedbacks(feedbacksResponse.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    });
  }, []);

  const handleAssign = () => {
    if (!selectedEmployee) {
      alert("Please select an employee to assign feedback to.");
      return;
    }

    if (assignedTo.length < 3) {
      alert("Please select at least three employees to provide feedback.");
      return;
    }

    axios.post("http://localhost:3000/assignments", {
      manager_id: 1,
      employee_id: selectedEmployee,
      assigned_to_ids: assignedTo,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => {
      alert("Employee successfully assigned feedback!");
      const newAssignments = assignedTo.map(assignedId => ({
        employee_id: selectedEmployee,
        assigned_to_id: assignedId
      }));

      setAssignments([...assignments, ...newAssignments]);
      setSelectedEmployee("");
      setAssignedTo([]);
    })
    .catch((error) => {
      console.error("Error assigning employees:", error.response?.data || error.message);
      alert(`Error assigning employees: ${error.response?.data?.error || "Unknown error"}`);
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin panel.</p>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "/";
  }}>
        Logout
        </button>
      </header>


      {loading ? (
        <p className="loading-text">Loading data...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <h2>All Employees</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Assign Feedback</h2>
          <label>Select Employee:</label>
          <select onChange={(e) => setSelectedEmployee(e.target.value)} className="dropdown">
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>

          <label>Assign To (Select 3-4 employees):</label>
          <select multiple onChange={(e) => setAssignedTo([...e.target.selectedOptions].map(option => option.value))} className="dropdown">
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>

          <button className="button" onClick={handleAssign}>Assign Feedback</button>

          <h2>Feedback Assignments & Status</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee Assigned</th>
                    <th>Assigned To</th>
                    <th>Feedback Given</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, index) => {
                    const employee = employees.find(e => e.id === assignment.employee_id) || { name: "Unknown" };
                    const assigned = employees.find(e => e.id === assignment.assigned_to_id) || { name: "Unknown" };

                    const feedback = feedbacks.find(fb => fb.giver_id === assignment.employee_id && fb.receiver_id === assignment.assigned_to_id);

                    return (
                      <tr key={index}>
                        <td>{employee.name}</td>
                        <td>{assigned.name}</td>
                        <td>{feedback ? `${feedback.content} (Rating: ${feedback.rating})` : "No feedback yet"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
                  )}
                </div>
  );
};

export default AdminDashboard;
