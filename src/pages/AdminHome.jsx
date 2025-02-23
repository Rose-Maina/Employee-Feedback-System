import { useState, useEffect } from "react";
import axios from "axios";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:3000/feedbacks").then((res) => setFeedbacks(res.data));
  }, []);

  return (
    <div className="card">
      <h1>Admin Dashboard</h1>
      
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.role}
          </li>
        ))}
      </ul>

      <h2>All Feedback</h2>
      <ul>
        {feedbacks.map((fb) => (
          <li key={fb.id}>
            <strong>From:</strong> {users.find(u => u.id === fb.giver_id)?.name} <br />
            <strong>To:</strong> {users.find(u => u.id === fb.receiver_id)?.name} <br />
            <strong>Rating:</strong> {fb.rating} <br />
            <strong>Comment:</strong> {fb.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHome;
