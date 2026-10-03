import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">
          🎓
        </div>

        <div>
          <h2>SchoolHub</h2>
          <span>Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">

        <p className="menu-title">
          MAIN MENU
        </p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">👨‍🎓</span>
          <span>Students</span>
        </NavLink>

        <NavLink
          to="/teachers"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">👨‍🏫</span>
          <span>Teachers</span>
        </NavLink>

        <NavLink
          to="/classes"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">🏫</span>
          <span>Classes</span>
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">📋</span>
          <span>Attendance</span>
        </NavLink>

        <NavLink
          to="/guardians"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">👪</span>
          <span>Guardians</span>
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className="nav-item"
        >
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </NavLink>

        <button className="logout-button">
          <span>🚪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;