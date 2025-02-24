
import { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ giverId, receiverId }) => {
  const [ratings, setRatings] = useState({
    teamwork: 5,
    collaboration: 5,
    communication: 5,
    problem_solving: 5,
    leadership: 5,
  });
  const [qualitativeFeedback, setQualitativeFeedback] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRatingChange = (dimension, value) => {
    setRatings({ ...ratings, [dimension]: value });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await axios.post("http://localhost:3000/feedbacks", {
        giver_id: giverId,
        receiver_id: receiverId,
        ratings,
        qualitative_feedback: qualitativeFeedback
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setSuccessMessage("Feedback submitted successfully!");
      setQualitativeFeedback("");
      setRatings({
        teamwork: 5,
        collaboration: 5,
        communication: 5,
        problem_solving: 5,
        leadership: 5,
      });
    } catch (error) {
      setErrorMessage("Error submitting feedback.");
    }
  };

  return (
    <form onSubmit={submitFeedback} className="card">
      <h3>Provide Feedback</h3>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}

      <h4>Quantitative Feedback</h4>
      {Object.keys(ratings).map((dimension) => (
        <div key={dimension}>
          <label>{dimension.replace("_", " ").toUpperCase()}</label>
          <input
            type="number"
            min="1"
            max="10"
            value={ratings[dimension]}
            onChange={(e) => handleRatingChange(dimension, parseInt(e.target.value))}
          />
        </div>
      ))}

      <h4>Qualitative Feedback</h4>
      <textarea
        placeholder="Write your detailed feedback here..."
        value={qualitativeFeedback}
        onChange={(e) => setQualitativeFeedback(e.target.value)}
      />

      <button className="button" type="submit">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;
