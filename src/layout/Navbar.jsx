import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="navbar">

      <div className="navbar-left">

        <button className="mobile-menu">
          ☰
        </button>

        <div>
          <h2>School Management System</h2>
          <p>Manage your school efficiently</p>
        </div>

      </div>

      <div className="navbar-right">

        <button className="notification-button">
          🔔

          <span className="notification-badge">
            3
          </span>
        </button>

        <div className="profile-container">

          <button
            className="profile-button"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >

            <div className="profile-avatar">
              A
            </div>

            <div className="profile-info">
              <strong>Admin User</strong>
              <span>Administrator</span>
            </div>

            <span className="profile-arrow">
              ▼
            </span>

          </button>

          {showProfile && (
            <div className="profile-dropdown">

              <button>
                👤 Profile
              </button>

              <button>
                ⚙️ Settings
              </button>

              <button>
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;