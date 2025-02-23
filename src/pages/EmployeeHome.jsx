
import { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";

const EmployeeHome = () => {
  const [employees, setEmployees] = useState([]);
  const giverId = 2; // This should be dynamically set from logged-in user

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then((response) => setEmployees(response.data.filter(user => user.role === "employee")))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="card">
      <h1>Employee Dashboard</h1>
      <h2>Submit Feedback</h2>
      {employees.map((employee) => (
        <FeedbackForm key={employee.id} giverId={giverId} receiverId={employee.id} />
      ))}
    </div>
  );
};

export default EmployeeHome;
