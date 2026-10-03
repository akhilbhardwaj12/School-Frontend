import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();

    // =====================================================
    // QUICK ACTIONS
    // =====================================================

    const handleAddStudent = () => {
        navigate("/students?action=add");
    };

    const handleAddTeacher = () => {
        navigate("/teachers?action=add");
    };

    const handleCreateClass = () => {
        navigate("/classes?action=add");
    };

    const handleMarkAttendance = () => {
        navigate("/attendance?action=mark");
    };

    return (
        <div className="dashboard-page">

            {/* =====================================================
                DASHBOARD HEADER
            ===================================================== */}

            <div className="dashboard-title-section">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's what's happening in your school.</p>
                </div>

                <div className="dashboard-date">
                    📅 Today
                </div>
            </div>

            {/* =====================================================
                STAT CARDS
            ===================================================== */}

            <div className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-icon student-icon">
                        👨‍🎓
                    </div>

                    <div>
                        <p>Total Students</p>
                        <h2>1,250</h2>
                        <span className="stat-positive">
                            ↑ 12% this month
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon teacher-icon">
                        👩‍🏫
                    </div>

                    <div>
                        <p>Total Teachers</p>
                        <h2>85</h2>
                        <span className="stat-positive">
                            ↑ 5% this month
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon class-icon">
                        🏫
                    </div>

                    <div>
                        <p>Total Classes</p>
                        <h2>32</h2>
                        <span className="stat-positive">
                            Active classes
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon attendance-icon">
                        📋
                    </div>

                    <div>
                        <p>Attendance</p>
                        <h2>94%</h2>
                        <span className="stat-positive">
                            ↑ 2% this week
                        </span>
                    </div>
                </div>

            </div>

            {/* =====================================================
                MAIN DASHBOARD GRID
            ===================================================== */}

            <div className="dashboard-main-grid">

                {/* =================================================
                    RECENT STUDENTS
                ================================================= */}

                <div className="dashboard-card recent-students-card">

                    <div className="card-header">
                        <div>
                            <h2>Recent Students</h2>
                            <p>Recently added students</p>
                        </div>

                        <button
                            type="button"
                            className="view-all-btn"
                            onClick={() => navigate("/students")}
                        >
                            View All
                        </button>
                    </div>

                    <div className="student-list">

                        <div className="student-item">
                            <div className="student-avatar">
                                AS
                            </div>

                            <div className="student-info">
                                <strong>Aarav Sharma</strong>
                                <span>Class 10-A</span>
                            </div>

                            <span className="active-badge">
                                Active
                            </span>
                        </div>

                        <div className="student-item">
                            <div className="student-avatar">
                                RK
                            </div>

                            <div className="student-info">
                                <strong>Riya Kapoor</strong>
                                <span>Class 9-B</span>
                            </div>

                            <span className="active-badge">
                                Active
                            </span>
                        </div>

                        <div className="student-item">
                            <div className="student-avatar">
                                VS
                            </div>

                            <div className="student-info">
                                <strong>Vihaan Singh</strong>
                                <span>Class 8-A</span>
                            </div>

                            <span className="active-badge">
                                Active
                            </span>
                        </div>

                        <div className="student-item">
                            <div className="student-avatar">
                                AP
                            </div>

                            <div className="student-info">
                                <strong>Ananya Patel</strong>
                                <span>Class 7-C</span>
                            </div>

                            <span className="active-badge">
                                Active
                            </span>
                        </div>

                    </div>
                </div>

                {/* =================================================
                    ATTENDANCE SUMMARY
                ================================================= */}

                <div className="dashboard-card attendance-card">

                    <div className="card-header">
                        <div>
                            <h2>Attendance Overview</h2>
                            <p>Today's attendance</p>
                        </div>

                        <button
                            type="button"
                            className="view-all-btn"
                            onClick={() => navigate("/attendance")}
                        >
                            View
                        </button>
                    </div>

                    <div className="attendance-content">

                        <div className="attendance-circle">

                            <div className="attendance-inner">
                                <strong>94%</strong>
                                <span>Present</span>
                            </div>

                        </div>

                        <div className="attendance-details">

                            <div className="attendance-row">
                                <span>
                                    <i className="dot present-dot"></i>
                                    Present
                                </span>

                                <strong>1,175</strong>
                            </div>

                            <div className="attendance-row">
                                <span>
                                    <i className="dot absent-dot"></i>
                                    Absent
                                </span>

                                <strong>50</strong>
                            </div>

                            <div className="attendance-row">
                                <span>
                                    <i className="dot leave-dot"></i>
                                    On Leave
                                </span>

                                <strong>25</strong>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            {/* =====================================================
                QUICK ACTIONS
            ===================================================== */}

            <div className="dashboard-card quick-actions-card">

                <div className="card-header">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>Quickly access frequently used features</p>
                    </div>
                </div>

                <div className="quick-actions-grid">

                    {/* ADD STUDENT */}

                    <button
                        type="button"
                        className="quick-action-btn"
                        onClick={handleAddStudent}
                    >
                        <span className="quick-action-icon">
                            👨‍🎓
                        </span>

                        <span className="quick-action-text">
                            <strong>Add Student</strong>
                            <small>Register a new student</small>
                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>
                    </button>


                    {/* ADD TEACHER */}

                    <button
                        type="button"
                        className="quick-action-btn"
                        onClick={handleAddTeacher}
                    >
                        <span className="quick-action-icon">
                            👩‍🏫
                        </span>

                        <span className="quick-action-text">
                            <strong>Add Teacher</strong>
                            <small>Register a new teacher</small>
                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>
                    </button>


                    {/* CREATE CLASS */}

                    <button
                        type="button"
                        className="quick-action-btn"
                        onClick={handleCreateClass}
                    >
                        <span className="quick-action-icon">
                            🏫
                        </span>

                        <span className="quick-action-text">
                            <strong>Create Class</strong>
                            <small>Create a new class</small>
                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>
                    </button>


                    {/* MARK ATTENDANCE */}

                    <button
                        type="button"
                        className="quick-action-btn"
                        onClick={handleMarkAttendance}
                    >
                        <span className="quick-action-icon">
                            📋
                        </span>

                        <span className="quick-action-text">
                            <strong>Mark Attendance</strong>
                            <small>Mark today's attendance</small>
                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;