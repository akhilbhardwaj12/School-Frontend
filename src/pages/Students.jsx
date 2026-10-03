import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Students.css";

// =====================================================
// API
// =====================================================

const API_BASE_URL = "http://localhost:5000/api";

const STUDENTS_API_URL = `${API_BASE_URL}/students`;
const CLASSES_API_URL = `${API_BASE_URL}/classes`;

// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    classId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
};

// =====================================================
// STUDENTS COMPONENT
// =====================================================

function Students() {
    // =====================================================
    // URL PARAMS
    // =====================================================

    const [searchParams, setSearchParams] =
        useSearchParams();

    // =====================================================
    // STUDENT STATE
    // =====================================================

    const [students, setStudents] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // MODAL STATE
    // =====================================================

    const [showModal, setShowModal] =
        useState(false);

    const [showViewModal, setShowViewModal] =
        useState(false);

    const [selectedStudent, setSelectedStudent] =
        useState(null);

    const [editingId, setEditingId] =
        useState(null);

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] =
        useState(emptyForm);

    // =====================================================
    // CLASS STATE
    // =====================================================

    const [classes, setClasses] =
        useState([]);

    const [classesLoading, setClassesLoading] =
        useState(false);

    // =====================================================
    // GET STUDENT ID
    // =====================================================

    const getStudentId = (student) => {
        return (
            student?._id ||
            student?.id ||
            ""
        );
    };

    // =====================================================
    // GET FIRST NAME
    // =====================================================

    const getFirstName = (student) => {
        return (
            student?.firstName ||
            student?.user?.firstName ||
            ""
        );
    };

    // =====================================================
    // GET LAST NAME
    // =====================================================

    const getLastName = (student) => {
        return (
            student?.lastName ||
            student?.user?.lastName ||
            ""
        );
    };

    // =====================================================
    // GET FULL NAME
    // =====================================================

    const getFullName = (student) => {
        const firstName =
            getFirstName(student);

        const lastName =
            getLastName(student);

        return (
            `${firstName} ${lastName}`.trim() ||
            "Unknown Student"
        );
    };

    // =====================================================
    // GET EMAIL
    // =====================================================

    const getEmail = (student) => {
        return (
            student?.email ||
            student?.user?.email ||
            "-"
        );
    };

    // =====================================================
    // GET PHONE
    // =====================================================

    const getPhone = (student) => {
        return (
            student?.phone ||
            student?.user?.phone ||
            student?.user?.contactInfo?.phone ||
            "-"
        );
    };

    // =====================================================
    // GET CLASS NAME
    // =====================================================

    const getClassName = (student) => {
        if (!student?.class) {
            return "Not Assigned";
        }

        if (
            typeof student.class === "string"
        ) {
            const foundClass =
                classes.find(
                    (item) =>
                        item?._id ===
                            student.class ||
                        item?.id ===
                            student.class
                );

            return (
                foundClass?.className ||
                student.class ||
                "Not Assigned"
            );
        }

        return (
            student?.class?.className ||
            student?.class?.name ||
            "Not Assigned"
        );
    };

    // =====================================================
    // GET CLASS ID
    // =====================================================

    const getClassId = (student) => {
        if (!student?.class) {
            return "";
        }

        if (
            typeof student.class === "string"
        ) {
            return student.class;
        }

        return (
            student?.class?._id ||
            student?.classId ||
            ""
        );
    };

    // =====================================================
    // GET GENDER
    // =====================================================

    const getGender = (student) => {
        const gender =
            student?.gender ||
            student?.user?.gender ||
            "";

        if (!gender) {
            return "-";
        }

        return (
            gender.charAt(0).toUpperCase() +
            gender.slice(1)
        );
    };

    // =====================================================
    // GET STATUS
    // =====================================================

    const isStudentActive = (student) => {
        if (
            typeof student?.isActive ===
            "boolean"
        ) {
            return student.isActive;
        }

        if (
            typeof student?.user?.isActive ===
            "boolean"
        ) {
            return student.user.isActive;
        }

        if (student?.status) {
            return (
                String(student.status)
                    .toLowerCase() ===
                "active"
            );
        }

        return true;
    };

    // =====================================================
    // FETCH STUDENTS
    // =====================================================

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await fetch(
                    STUDENTS_API_URL
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Failed to fetch students"
                );
            }

            const studentList =
                Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(
                          data?.students
                      )
                    ? data.students
                    : Array.isArray(
                          data?.result
                      )
                    ? data.result
                    : [];

            setStudents(
                studentList.filter(
                    (student) =>
                        student &&
                        typeof student ===
                            "object"
                )
            );
        } catch (err) {
            console.error(
                "Fetch students error:",
                err
            );

            setStudents([]);

            setError(
                err?.message ||
                    "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH CLASSES
    // =====================================================

    const fetchClasses = async () => {
        try {
            setClassesLoading(true);

            const response =
                await fetch(
                    CLASSES_API_URL
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Failed to fetch classes"
                );
            }

            const classList =
                Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(
                          data?.classes
                      )
                    ? data.classes
                    : Array.isArray(
                          data?.result
                      )
                    ? data.result
                    : [];

            setClasses(
                classList.filter(
                    (item) =>
                        item &&
                        typeof item ===
                            "object" &&
                        item.isActive !== false
                )
            );
        } catch (err) {
            console.error(
                "Fetch classes error:",
                err
            );

            setClasses([]);
        } finally {
            setClassesLoading(false);
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
    // DASHBOARD QUICK ACTION
    // /students?action=add
    // =====================================================

    useEffect(() => {
        const action =
            searchParams.get("action");

        if (
            action === "add" &&
            !showModal
        ) {
            openAddModal();

            // Remove action from URL
            setSearchParams(
                {},
                {
                    replace: true,
                }
            );
        }
    }, [
        searchParams,
        showModal,
        setSearchParams,
    ]);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {
        setEditingId(null);

        setFormData({
            ...emptyForm,
        });

        setError("");

        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (student) => {
        const user =
            student?.user || {};

        const studentId =
            getStudentId(student);

        if (!studentId) {
            alert(
                "Student ID not found."
            );
            return;
        }

        setEditingId(studentId);

        setFormData({
            firstName:
                getFirstName(student),

            lastName:
                getLastName(student),

            email:
                getEmail(student) === "-"
                    ? ""
                    : getEmail(student),

            phone:
                getPhone(student) === "-"
                    ? ""
                    : getPhone(student),

            emergencyContact:
                student?.emergencyContact ||
                "",

            classId:
                getClassId(student),

            dateOfBirth:
                student?.dateOfBirth
                    ? String(
                          student.dateOfBirth
                      ).substring(0, 10)
                    : "",

            gender:
                student?.gender ||
                user?.gender ||
                "",

            address:
                typeof student?.address ===
                "string"
                    ? student.address
                    : student?.address
                          ?.street ||
                      "",
        });

        setError("");

        setShowViewModal(false);

        setShowModal(true);
    };

    // =====================================================
    // OPEN VIEW MODAL
    // =====================================================

    const openViewModal = async (
        student
    ) => {
        const studentId =
            getStudentId(student);

        if (!studentId) {
            alert(
                "Student ID not found."
            );
            return;
        }

        try {
            setError("");

            const response =
                await fetch(
                    `${STUDENTS_API_URL}/${studentId}`
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Failed to load student"
                );
            }

            setSelectedStudent(
                data?.data || student
            );

            setShowViewModal(true);
        } catch (err) {
            console.error(
                "View student error:",
                err
            );

            // Fallback to existing row data
            setSelectedStudent(student);

            setShowViewModal(true);
        }
    };

    // =====================================================
    // CLOSE ADD / EDIT MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);

        setEditingId(null);

        setFormData({
            ...emptyForm,
        });

        setError("");
    };

    // =====================================================
    // CLOSE VIEW MODAL
    // =====================================================

    const closeViewModal = () => {
        setShowViewModal(false);

        setSelectedStudent(null);
    };

    // =====================================================
    // CREATE / UPDATE STUDENT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            // ---------------------------------------------
            // IMPORTANT:
            // Backend expects gender as:
            // male / female / other
            // ---------------------------------------------

            const normalizedGender =
                formData.gender
                    ? formData.gender
                          .trim()
                          .toLowerCase()
                    : undefined;

            const payload = {
                firstName:
                    formData.firstName.trim(),

                lastName:
                    formData.lastName.trim(),

                email:
                    formData.email
                        .trim()
                        .toLowerCase(),

                phone:
                    formData.phone.trim(),

                emergencyContact:
                    formData.emergencyContact.trim(),

                classId:
                    formData.classId || undefined,

                dateOfBirth:
                    formData.dateOfBirth ||
                    undefined,

                gender:
                    normalizedGender,

                address:
                    formData.address.trim(),
            };

            const url = editingId
                ? `${STUDENTS_API_URL}/${editingId}`
                : STUDENTS_API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            console.log(
                "Student request:",
                {
                    url,
                    method,
                    payload,
                }
            );

            const response =
                await fetch(url, {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        payload
                    ),
                });

            const data =
                await response.json();

            console.log(
                "Student response:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        `Failed to ${
                            editingId
                                ? "update"
                                : "create"
                        } student`
                );
            }

            alert(
                editingId
                    ? "Student updated successfully."
                    : "Student created successfully."
            );

            closeModal();

            await fetchStudents();
        } catch (err) {
            console.error(
                "Save student error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to save student"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE STUDENT
    // =====================================================

    const handleDelete = async (
        student
    ) => {
        const studentId =
            getStudentId(student);

        if (!studentId) {
            alert(
                "Student ID not found."
            );
            return;
        }

        const studentName =
            getFullName(student);

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${studentName}?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${STUDENTS_API_URL}/${studentId}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Failed to delete student"
                );
            }

            alert(
                "Student deleted successfully."
            );

            await fetchStudents();
        } catch (err) {
            console.error(
                "Delete student error:",
                err
            );

            alert(
                err?.message ||
                    "Unable to delete student"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // ACTIVATE / DEACTIVATE
    // =====================================================

    const toggleStudentStatus =
        async (student) => {
            const studentId =
                getStudentId(student);

            if (!studentId) {
                alert(
                    "Student ID not found."
                );
                return;
            }

            const active =
                isStudentActive(student);

            const action = active
                ? "deactivate"
                : "activate";

            const confirmed =
                window.confirm(
                    `Are you sure you want to ${action} ${getFullName(
                        student
                    )}?`
                );

            if (!confirmed) {
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        `${STUDENTS_API_URL}/${studentId}/${action}`,
                        {
                            method: "PATCH",
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                            `Failed to ${action} student`
                    );
                }

                await fetchStudents();
            } catch (err) {
                console.error(
                    "Status update error:",
                    err
                );

                alert(
                    err?.message ||
                        `Unable to ${action} student`
                );
            } finally {
                setLoading(false);
            }
        };

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredStudents =
        students.filter(
            (student) => {
                const name =
                    getFullName(
                        student
                    ).toLowerCase();

                const email =
                    getEmail(
                        student
                    ).toLowerCase();

                const phone =
                    getPhone(
                        student
                    ).toLowerCase();

                const searchValue =
                    search
                        .trim()
                        .toLowerCase();

                return (
                    name.includes(
                        searchValue
                    ) ||
                    email.includes(
                        searchValue
                    ) ||
                    phone.includes(
                        searchValue
                    )
                );
            }
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="students-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="students-header">

                <div>
                    <h1>
                        Students
                    </h1>

                    <p>
                        Manage school students
                    </p>
                </div>

                <button
                    type="button"
                    className="add-btn"
                    onClick={
                        openAddModal
                    }
                >
                    + Add Student
                </button>

            </div>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="students-toolbar">

                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <button
                    type="button"
                    onClick={
                        fetchStudents
                    }
                    disabled={loading}
                >
                    {loading
                        ? "Loading..."
                        : "↻ Refresh"}
                </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="students-table-container">

                {loading &&
                students.length === 0 ? (
                    <div className="empty-state">
                        Loading students...
                    </div>
                ) : filteredStudents.length ===
                  0 ? (
                    <div className="empty-state">

                        <h3>
                            No students found
                        </h3>

                        <p>
                            {search
                                ? "Try a different search."
                                : "Create your first student."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                className="add-btn"
                                onClick={
                                    openAddModal
                                }
                            >
                                + Add Student
                            </button>
                        )}

                    </div>
                ) : (
                    <div
                        style={{
                            overflowX:
                                "auto",
                            width: "100%",
                        }}
                    >

                        <table className="students-table">

                            <thead>
                                <tr>

                                    <th>
                                        STUDENT
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

                                    <th>
                                        PHONE
                                    </th>

                                    <th>
                                        CLASS
                                    </th>

                                    <th>
                                        GENDER
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredStudents.map(
                                    (
                                        student,
                                        index
                                    ) => {

                                        const id =
                                            getStudentId(
                                                student
                                            );

                                        const active =
                                            isStudentActive(
                                                student
                                            );

                                        return (
                                            <tr
                                                key={
                                                    id ||
                                                    index
                                                }
                                            >

                                                {/* STUDENT */}

                                                <td>
                                                    <strong>
                                                        {
                                                            getFullName(
                                                                student
                                                            )
                                                        }
                                                    </strong>
                                                </td>

                                                {/* EMAIL */}

                                                <td>
                                                    {
                                                        getEmail(
                                                            student
                                                        )
                                                    }
                                                </td>

                                                {/* PHONE */}

                                                <td>
                                                    {
                                                        getPhone(
                                                            student
                                                        )
                                                    }
                                                </td>

                                                {/* CLASS */}

                                                <td>
                                                    {
                                                        getClassName(
                                                            student
                                                        )
                                                    }
                                                </td>

                                                {/* GENDER */}

                                                <td>
                                                    {
                                                        getGender(
                                                            student
                                                        )
                                                    }
                                                </td>

                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            active
                                                                ? "status-badge active"
                                                                : "status-badge inactive"
                                                        }
                                                    >
                                                        {active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>

                                                </td>

                                                {/* ACTIONS */}

                                                <td>

                                                    <div
                                                        className="action-buttons"
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "8px",
                                                            flexWrap:
                                                                "wrap",
                                                        }}
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openViewModal(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        {/* ACTIVATE / DEACTIVATE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleStudentStatus(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            {active
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="student-modal">

                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingId
                                        ? "Edit Student"
                                        : "Add Student"}
                                </h2>

                                <p>
                                    {editingId
                                        ? "Update student information."
                                        : "Create a new student."}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
                            >
                                ×
                            </button>

                        </div>

                        {/* MODAL ERROR */}

                        {error && (
                            <div className="modal-error">
                                {error}
                            </div>
                        )}

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="form-grid">

                                {/* FIRST NAME */}

                                <div className="form-group">

                                    <label>
                                        First Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={
                                            formData.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                                {/* LAST NAME */}

                                <div className="form-group">

                                    <label>
                                        Last Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={
                                            formData.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                                {/* EMAIL */}

                                <div className="form-group">

                                    <label>
                                        Email *
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                                {/* PHONE */}

                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {/* EMERGENCY CONTACT */}

                                <div className="form-group">

                                    <label>
                                        Emergency Contact
                                    </label>

                                    <input
                                        type="text"
                                        name="emergencyContact"
                                        value={
                                            formData.emergencyContact
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {/* CLASS */}

                                <div className="form-group">

                                    <label>
                                        Class
                                    </label>

                                    <select
                                        name="classId"
                                        value={
                                            formData.classId ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            classesLoading
                                        }
                                    >

                                        <option value="">
                                            {classesLoading
                                                ? "Loading classes..."
                                                : "Select Class"}
                                        </option>

                                        {classes.map(
                                            (
                                                item
                                            ) => {

                                                const classId =
                                                    item?._id ||
                                                    item?.id;

                                                return (
                                                    <option
                                                        key={
                                                            classId
                                                        }
                                                        value={
                                                            classId
                                                        }
                                                    >
                                                        {
                                                            item?.className
                                                        }

                                                        {item?.classCode
                                                            ? ` (${item.classCode})`
                                                            : ""}
                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>

                                </div>

                                {/* DATE OF BIRTH */}

                                <div className="form-group">

                                    <label>
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={
                                            formData.dateOfBirth
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {/* GENDER */}

                                <div className="form-group">

                                    <label>
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={
                                            formData.gender
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="male">
                                            Male
                                        </option>

                                        <option value="female">
                                            Female
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                                {/* ADDRESS */}

                                <div className="form-group full-width">

                                    <label>
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="3"
                                    />

                                </div>

                            </div>

                            {/* MODAL ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                        ? "Update Student"
                                        : "Create Student"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {showViewModal &&
                selectedStudent && (
                    <div
                        className="modal-overlay"
                        onMouseDown={(event) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeViewModal();
                            }

                        }}
                    >

                        <div className="student-modal">

                            {/* HEADER */}

                            <div className="modal-header">

                                <div>

                                    <h2>
                                        {
                                            getFullName(
                                                selectedStudent
                                            )
                                        }
                                    </h2>

                                    <p>
                                        Student Details
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="close-btn"
                                    onClick={
                                        closeViewModal
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            {/* DETAILS */}

                            <div className="student-details">

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {
                                        getEmail(
                                            selectedStudent
                                        )
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Phone:
                                    </strong>{" "}
                                    {
                                        getPhone(
                                            selectedStudent
                                        )
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Class:
                                    </strong>{" "}
                                    {
                                        getClassName(
                                            selectedStudent
                                        )
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Gender:
                                    </strong>{" "}
                                    {
                                        getGender(
                                            selectedStudent
                                        )
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Emergency Contact:
                                    </strong>{" "}
                                    {
                                        selectedStudent?.emergencyContact ||
                                        "-"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Date of Birth:
                                    </strong>{" "}
                                    {
                                        selectedStudent?.dateOfBirth
                                            ? String(
                                                  selectedStudent.dateOfBirth
                                              ).substring(
                                                  0,
                                                  10
                                              )
                                            : "-"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Address:
                                    </strong>{" "}
                                    {typeof selectedStudent?.address ===
                                    "string"
                                        ? selectedStudent.address ||
                                          "-"
                                        : selectedStudent?.address
                                              ?.street ||
                                          "-"}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {isStudentActive(
                                        selectedStudent
                                    )
                                        ? "Active"
                                        : "Inactive"}
                                </p>

                            </div>

                            {/* VIEW ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        closeViewModal
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="save-btn"
                                    onClick={() =>
                                        openEditModal(
                                            selectedStudent
                                        )
                                    }
                                >
                                    Edit Student
                                </button>

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => {

                                        closeViewModal();

                                        handleDelete(
                                            selectedStudent
                                        );

                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </div>
    );
}

export default Students;