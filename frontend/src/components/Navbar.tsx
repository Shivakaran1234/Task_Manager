import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">Task Manager</span>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">📋 Dashboard</Link>
          <Link to="/add" className="nav-link">🧠 Smart Add</Link>
          <Link to="/focus" className="nav-link">🎯 Focus Mode</Link>
        </div>
      </div>
    </nav>
  );
}
