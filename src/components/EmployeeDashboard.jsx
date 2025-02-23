import { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";

const EmployeeDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((response) => {
      const loggedInUser = response.data.find(user => user.email === localStorage.getItem("email"));
      setUser(loggedInUser);
      return axios.get("http://localhost:3000/assignments");
    })
    .then((response) => {
      // Filter assignments where the logged-in employee is the giver
      const assignedTasks = response.data.filter(a => a.employee_id === user?.id);
      setAssignments(assignedTasks);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching assignments:", error);
      setError("Failed to load your assignments.");
      setLoading(false);
    });
  }, [user?.id]);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || "Employee"}!</h1>

      {loading ? (
        <p className="loading-text">Loading assigned feedback tasks...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : assignments.length > 0 ? (
        <div className="feedback-grid">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="feedback-card">
              <h3>Provide Feedback for {assignment.assigned_to?.name || `Employee ${assignment.assigned_to_id}`}</h3>
              <FeedbackForm giverId={user.id} receiverId={assignment.assigned_to_id} />
            </div>
          ))}
        </div>
      ) : (
        <p className="no-feedback-text">No feedback assignments yet.</p>
      )}
    </div>
  );
};

export default EmployeeDashboard;
