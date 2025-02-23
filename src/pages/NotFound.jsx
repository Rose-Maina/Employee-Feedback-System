
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="card">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="button">Go Home</Link>
    </div>
  );
};

export default NotFound;  // ✅ Ensure default export
