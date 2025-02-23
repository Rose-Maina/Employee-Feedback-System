
import { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ giverId, receiverId }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const submitFeedback = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!content.trim()) {
      setErrorMessage("Feedback cannot be empty.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/feedbacks", {
        giver_id: giverId,
        receiver_id: receiverId,
        content,
        rating
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setSuccessMessage("Feedback submitted successfully!");
      setContent("");
      setRating(5);
    } catch (error) {
      setErrorMessage("Error submitting feedback.");
    }
  };

  return (
    <form onSubmit={submitFeedback} className="card">
      <h3>Provide Feedback</h3>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
      <textarea placeholder="Write your feedback..." value={content} onChange={(e) => setContent(e.target.value)} />
      <input type="number" min="1" max="10" value={rating} onChange={(e) => setRating(e.target.value)} />
      <button className="button" type="submit">Submit</button>
    </form>
  );
};

export default FeedbackForm;
