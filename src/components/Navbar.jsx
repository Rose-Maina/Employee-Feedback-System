
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/admin") || location.pathname.includes("/employee");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <h1>Employee Feedback System</h1>
      <div>
        {!isDashboard ? (
          <Link to="/" className="button">Sign In</Link>
        ) : (
          <button className="button logout" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
