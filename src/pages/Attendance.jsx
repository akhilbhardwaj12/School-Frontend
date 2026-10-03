import React, { useEffect, useMemo, useState } from "react";
import "./Attendance.css";

const STUDENTS_API = "http://localhost:5000/api/students";
const CLASSES_API = "http://localhost:5000/api/classes";
const ATTENDANCE_API = "http://localhost:5000/api/attendance";

const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [selectedClass, setSelectedClass] = useState("");
    const [search, setSearch] = useState("");

    const [attendance, setAttendance] = useState({});

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // GET STUDENT NAME
    // =====================================================

    const getStudentName = (student) => {
        if (student?.user) {
            return `${student.user.firstName || ""} ${
                student.user.lastName || ""
            }`.trim();
        }

        return `${student?.firstName || ""} ${
            student?.lastName || ""
        }`.trim();
    };

    // =====================================================
    // GET STUDENT ID
    // =====================================================

    const getStudentId = (student) => {
        return student?._id || student?.id;
    };

    // =====================================================
    // GET CLASS NAME
    // =====================================================

    const getClassName = (student) => {
        if (!student?.class) {
            return "Not Assigned";
        }

        if (typeof student.class === "string") {
            return student.class;
        }

        return (
            student.class.className ||
            student.class.name ||
            student.class.classCode ||
            "Not Assigned"
        );
    };

    // =====================================================
    // FETCH STUDENTS
    // =====================================================

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(STUDENTS_API);

            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await response.json();

            const studentList =
                data?.students ||
                data?.result ||
                data?.data ||
                [];

            setStudents(Array.isArray(studentList) ? studentList : []);
        } catch (err) {
            console.error("Fetch students error:", err);
            setError("Unable to load students.");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH CLASSES
    // =====================================================

    const fetchClasses = async () => {
        try {
            const response = await fetch(CLASSES_API);

            if (!response.ok) {
                throw new Error("Failed to fetch classes");
            }

            const data = await response.json();

            const classList =
                data?.classes ||
                data?.result ||
                data?.data ||
                [];

            setClasses(Array.isArray(classList) ? classList : []);
        } catch (err) {
            console.error("Fetch classes error:", err);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    // =====================================================
    // FILTER STUDENTS
    // =====================================================

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const name = getStudentName(student).toLowerCase();
            const email = (
                student?.user?.email ||
                student?.email ||
                ""
            ).toLowerCase();

            const admissionNo = (
                student?.admissionNo ||
                student?.studentId ||
                ""
            ).toLowerCase();

            const className = getClassName(student).toLowerCase();

            const searchText = search.toLowerCase();

            const matchesSearch =
                name.includes(searchText) ||
                email.includes(searchText) ||
                admissionNo.includes(searchText) ||
                className.includes(searchText);

            const matchesClass =
                !selectedClass ||
                String(student?.class?._id || student?.class?.id || student?.class) ===
                    String(selectedClass);

            return matchesSearch && matchesClass;
        });
    }, [students, search, selectedClass]);

    // =====================================================
    // SET ATTENDANCE
    // =====================================================

    const setStudentAttendance = (studentId, status) => {
        setAttendance((previous) => ({
            ...previous,
            [studentId]: status,
        }));
    };

    // =====================================================
    // MARK ALL
    // =====================================================

    const markAll = (status) => {
        const updatedAttendance = {};

        filteredStudents.forEach((student) => {
            const studentId = getStudentId(student);

            if (studentId) {
                updatedAttendance[studentId] = status;
            }
        });

        setAttendance((previous) => ({
            ...previous,
            ...updatedAttendance,
        }));
    };

    // =====================================================
    // SUMMARY
    // =====================================================

    const presentCount = filteredStudents.filter(
        (student) =>
            attendance[getStudentId(student)] === "Present"
    ).length;

    const absentCount = filteredStudents.filter(
        (student) =>
            attendance[getStudentId(student)] === "Absent"
    ).length;

    const leaveCount = filteredStudents.filter(
        (student) =>
            attendance[getStudentId(student)] === "Leave"
    ).length;

    const unmarkedCount =
        filteredStudents.length -
        presentCount -
        absentCount -
        leaveCount;

    // =====================================================
    // SAVE ATTENDANCE
    // =====================================================

    const handleSaveAttendance = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!selectedDate) {
                setError("Please select attendance date.");
                return;
            }

            if (filteredStudents.length === 0) {
                setError("No students found.");
                return;
            }

            const records = filteredStudents.map((student) => {
                const studentId = getStudentId(student);

                return {
                    student: studentId,
                    studentId: studentId,
                    date: selectedDate,
                    status: attendance[studentId] || "Present",
                };
            });

            const response = await fetch(ATTENDANCE_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: selectedDate,
                    classId: selectedClass || null,
                    records,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to save attendance"
                );
            }

            setSuccess("Attendance saved successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error("Save attendance error:", err);

            setError(
                err.message || "Unable to save attendance."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = async () => {
        setAttendance({});
        setSearch("");
        setError("");
        setSuccess("");

        await fetchStudents();
        await fetchClasses();
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="attendance-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="attendance-header">

                <div>
                    <h1>Attendance</h1>

                    <p>
                        Manage and mark student attendance
                    </p>
                </div>

                <div className="attendance-header-actions">

                    <button
                        type="button"
                        className="attendance-refresh-btn"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        ↻ Refresh
                    </button>

                    <button
                        type="button"
                        className="attendance-save-btn"
                        onClick={handleSaveAttendance}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "✓ Save Attendance"}
                    </button>

                </div>
            </div>

            {/* =================================================
                MESSAGES
            ================================================= */}

            {error && (
                <div className="attendance-alert attendance-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="attendance-alert attendance-success">
                    {success}
                </div>
            )}

            {/* =================================================
                FILTER CARD
            ================================================= */}

            <div className="attendance-filter-card">

                <div className="attendance-filter">

                    <div className="attendance-field">
                        <label>Date</label>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) =>
                                setSelectedDate(e.target.value)
                            }
                        />
                    </div>

                    <div className="attendance-field">
                        <label>Class</label>

                        <select
                            value={selectedClass}
                            onChange={(e) =>
                                setSelectedClass(e.target.value)
                            }
                        >
                            <option value="">
                                All Classes
                            </option>

                            {classes.map((item) => (
                                <option
                                    key={item._id || item.id}
                                    value={item._id || item.id}
                                >
                                    {item.className ||
                                        item.name ||
                                        item.classCode}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="attendance-field attendance-search">
                        <label>Search</label>

                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                </div>

                {/* MARK ALL */}

                <div className="attendance-mark-actions">

                    <button
                        type="button"
                        onClick={() => markAll("Present")}
                        className="mark-present-btn"
                    >
                        ✓ Mark All Present
                    </button>

                    <button
                        type="button"
                        onClick={() => markAll("Absent")}
                        className="mark-absent-btn"
                    >
                        ✕ Mark All Absent
                    </button>

                    <button
                        type="button"
                        onClick={() => markAll("Leave")}
                        className="mark-leave-btn"
                    >
                        ◷ Mark All Leave
                    </button>

                </div>
            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="attendance-summary">

                <div className="summary-card">
                    <span>Total Students</span>
                    <strong>{filteredStudents.length}</strong>
                </div>

                <div className="summary-card summary-present">
                    <span>Present</span>
                    <strong>{presentCount}</strong>
                </div>

                <div className="summary-card summary-absent">
                    <span>Absent</span>
                    <strong>{absentCount}</strong>
                </div>

                <div className="summary-card summary-leave">
                    <span>On Leave</span>
                    <strong>{leaveCount}</strong>
                </div>

                <div className="summary-card summary-unmarked">
                    <span>Unmarked</span>
                    <strong>{unmarkedCount}</strong>
                </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="attendance-table-card">

                <div className="attendance-table-wrapper">

                    <table className="attendance-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student</th>
                                <th>Admission No.</th>
                                <th>Class</th>
                                <th>Gender</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="attendance-empty"
                                    >
                                        Loading students...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="attendance-empty"
                                    >
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map(
                                    (student, index) => {
                                        const studentId =
                                            getStudentId(
                                                student
                                            );

                                        const status =
                                            attendance[
                                                studentId
                                            ] || "";

                                        return (
                                            <tr key={studentId}>

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <div className="student-name">
                                                        {getStudentName(
                                                            student
                                                        )}
                                                    </div>

                                                    <div className="student-email">
                                                        {student?.user
                                                            ?.email ||
                                                            student?.email ||
                                                            "-"}
                                                    </div>
                                                </td>

                                                <td>
                                                    {student?.admissionNo ||
                                                        student?.studentId ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {getClassName(
                                                            student
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {student?.user
                                                        ?.gender ||
                                                        student?.gender ||
                                                        "-"}
                                                </td>

                                                <td>

                                                    <div className="attendance-buttons">

                                                        <button
                                                            type="button"
                                                            className={`attendance-status-btn present ${
                                                                status ===
                                                                "Present"
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                setStudentAttendance(
                                                                    studentId,
                                                                    "Present"
                                                                )
                                                            }
                                                        >
                                                            ✓ Present
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={`attendance-status-btn absent ${
                                                                status ===
                                                                "Absent"
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                setStudentAttendance(
                                                                    studentId,
                                                                    "Absent"
                                                                )
                                                            }
                                                        >
                                                            ✕ Absent
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={`attendance-status-btn leave ${
                                                                status ===
                                                                "Leave"
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                setStudentAttendance(
                                                                    studentId,
                                                                    "Leave"
                                                                )
                                                            }
                                                        >
                                                            ◷ Leave
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )
                            )}

                        </tbody>

                    </table>

                </div>
            </div>
        </div>
    );
};

export default Attendance;