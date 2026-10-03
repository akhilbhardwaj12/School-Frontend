import React, { useEffect, useMemo, useState } from "react";
import "./Teachers.css";

const API_URL = `${import.meta.env.VITE_API_URL}/teachers`;

const EMPTY_FORM = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    status: "Active",
};

function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const [formData, setFormData] = useState({
        ...EMPTY_FORM,
    });

    // =====================================================
    // GET TEACHER ID
    // =====================================================

    const getTeacherId = (teacher) => {
        return teacher?._id || teacher?.id || null;
    };

    // =====================================================
    // GET NAME
    // =====================================================

    const getTeacherName = (teacher) => {
        const firstName =
            teacher?.firstName ||
            teacher?.user?.firstName ||
            "";

        const lastName =
            teacher?.lastName ||
            teacher?.user?.lastName ||
            "";

        return (
            `${firstName} ${lastName}`.trim() ||
            "Unknown Teacher"
        );
    };

    // =====================================================
    // GET EMAIL
    // =====================================================

    const getEmail = (teacher) => {
        return (
            teacher?.email ||
            teacher?.user?.email ||
            "-"
        );
    };

    // =====================================================
    // GET PHONE
    // =====================================================

    const getPhone = (teacher) => {
        return (
            teacher?.phone ||
            teacher?.user?.phone ||
            "-"
        );
    };

    // =====================================================
    // GET GENDER
    // =====================================================

    const getGender = (teacher) => {
        const gender =
            teacher?.gender ||
            teacher?.user?.gender ||
            "";

        if (!gender) return "-";

        return (
            gender.charAt(0).toUpperCase() +
            gender.slice(1).toLowerCase()
        );
    };

    // =====================================================
    // NORMALIZE GENDER FOR BACKEND
    // =====================================================

    const normalizeGender = (gender) => {
        if (!gender) return undefined;

        const value = gender.toLowerCase();

        if (value === "male") return "male";
        if (value === "female") return "female";
        if (value === "other") return "other";

        return undefined;
    };

    // =====================================================
    // GET STATUS
    // =====================================================

    const getStatus = (teacher) => {
        if (teacher?.status) {
            return teacher.status;
        }

        if (teacher?.isActive === false) {
            return "Inactive";
        }

        if (teacher?.user?.isActive === false) {
            return "Inactive";
        }

        return "Active";
    };

    // =====================================================
    // GET ADDRESS
    // =====================================================

    const getAddress = (teacher) => {
        const address =
            teacher?.address ||
            teacher?.user?.address;

        if (!address) {
            return "-";
        }

        if (typeof address === "string") {
            return address;
        }

        return (
            address?.street ||
            address?.city ||
            "-"
        );
    };

    // =====================================================
    // FETCH TEACHERS
    // =====================================================

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || data?.success === false) {
                throw new Error(
                    data?.message ||
                    "Failed to fetch teachers"
                );
            }

            const teacherList =
                Array.isArray(data?.result)
                    ? data.result
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.teachers)
                            ? data.teachers
                            : [];

            setTeachers(
                teacherList.filter(
                    (teacher) =>
                        teacher &&
                        typeof teacher === "object"
                )
            );
        } catch (err) {
            console.error(
                "Fetch teachers error:",
                err
            );

            setTeachers([]);

            setError(
                err?.message ||
                "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchTeachers();
    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredTeachers = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        if (!keyword) {
            return teachers;
        }

        return teachers.filter((teacher) => {
            const text = `
                ${getTeacherName(teacher)}
                ${getEmail(teacher)}
                ${getPhone(teacher)}
                ${teacher?.qualification || ""}
                ${teacher?.specialization || ""}
                ${getGender(teacher)}
                ${getStatus(teacher)}
            `.toLowerCase();

            return text.includes(keyword);
        });
    }, [teachers, search]);

    // =====================================================
    // OPEN VIEW
    // =====================================================

    const openViewModal = (teacher) => {
        const id = getTeacherId(teacher);

        if (!id) {
            alert("Teacher ID not found.");
            return;
        }

        setSelectedTeacher(teacher);
        setModalMode("view");
        setShowModal(true);
        setError("");
    };

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEditModal = (teacher) => {
        const id = getTeacherId(teacher);

        if (!id) {
            alert("Teacher ID not found.");
            return;
        }

        const gender =
            teacher?.gender ||
            teacher?.user?.gender ||
            "";

        setSelectedTeacher(teacher);

        setFormData({
            firstName:
                teacher?.firstName ||
                teacher?.user?.firstName ||
                "",

            lastName:
                teacher?.lastName ||
                teacher?.user?.lastName ||
                "",

            email:
                teacher?.email ||
                teacher?.user?.email ||
                "",

            phone:
                teacher?.phone ||
                teacher?.user?.phone ||
                "",

            qualification:
                teacher?.qualification ||
                "",

            specialization:
                teacher?.specialization ||
                "",

            gender: gender
                ? gender.toLowerCase()
                : "",

            dateOfBirth:
                teacher?.dateOfBirth
                    ? String(
                        teacher.dateOfBirth
                    ).substring(0, 10)
                    : teacher?.user?.dateOfBirth
                        ? String(
                            teacher.user.dateOfBirth
                        ).substring(0, 10)
                        : "",

            address:
                getAddress(teacher) === "-"
                    ? ""
                    : getAddress(teacher),

            status: getStatus(teacher),
        });

        setModalMode("edit");
        setShowModal(true);
        setError("");
    };

    // =====================================================
    // OPEN ADD
    // =====================================================

    const openAddModal = () => {
        setSelectedTeacher(null);

        setFormData({
            ...EMPTY_FORM,
        });

        setModalMode("add");
        setShowModal(true);
        setError("");
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving || deleting) {
            return;
        }

        setShowModal(false);
        setSelectedTeacher(null);
        setModalMode("view");

        setFormData({
            ...EMPTY_FORM,
        });

        setError("");
    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // CREATE TEACHER
    // =====================================================

    const handleCreateTeacher = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

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

                qualification:
                    formData.qualification.trim(),

                specialization:
                    formData.specialization.trim(),

                gender:
                    normalizeGender(
                        formData.gender
                    ),

                dateOfBirth:
                    formData.dateOfBirth ||
                    undefined,

                address:
                    formData.address.trim(),
            };

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(payload),
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                data?.success === false
            ) {
                throw new Error(
                    data?.message ||
                    "Failed to create teacher"
                );
            }

            alert(
                data?.message ||
                "Teacher created successfully"
            );

            closeModal();

            await fetchTeachers();
        } catch (err) {
            console.error(
                "Create teacher error:",
                err
            );

            setError(
                err?.message ||
                "Unable to create teacher"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // UPDATE TEACHER
    // =====================================================

    const handleUpdateTeacher = async (e) => {
        e.preventDefault();

        const teacherId =
            getTeacherId(selectedTeacher);

        if (!teacherId) {
            setError(
                "Teacher ID is missing."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

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

                qualification:
                    formData.qualification.trim(),

                specialization:
                    formData.specialization.trim(),

                gender:
                    normalizeGender(
                        formData.gender
                    ),

                dateOfBirth:
                    formData.dateOfBirth ||
                    undefined,

                address:
                    formData.address.trim(),

                isActive:
                    formData.status ===
                    "Active",
            };

            const response = await fetch(
                `${API_URL}/${teacherId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(payload),
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                data?.success === false
            ) {
                throw new Error(
                    data?.message ||
                    "Failed to update teacher"
                );
            }

            alert(
                data?.message ||
                "Teacher updated successfully"
            );

            closeModal();

            await fetchTeachers();
        } catch (err) {
            console.error(
                "Update teacher error:",
                err
            );

            setError(
                err?.message ||
                "Unable to update teacher"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE ONLY SELECTED TEACHER
    // =====================================================

    const handleDeleteTeacher = async (teacher) => {
        const teacherId =
            getTeacherId(teacher);

        if (!teacherId) {
            alert("Teacher ID is missing.");
            return;
        }

        const teacherName =
            getTeacherName(teacher);

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${teacherName}?\n\nThis action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const response = await fetch(
                `${API_URL}/${teacherId}`,
                {
                    method: "DELETE",
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                data?.success === false
            ) {
                throw new Error(
                    data?.message ||
                    "Failed to delete teacher"
                );
            }

            // IMPORTANT:
            // Remove ONLY the teacher whose ID
            // was deleted.
            setTeachers((previous) =>
                previous.filter(
                    (item) =>
                        getTeacherId(item) !==
                        teacherId
                )
            );

            if (
                selectedTeacher &&
                getTeacherId(
                    selectedTeacher
                ) === teacherId
            ) {
                setShowModal(false);
                setSelectedTeacher(null);
            }

            alert(
                data?.message ||
                "Teacher deleted successfully"
            );
        } catch (err) {
            console.error(
                "Delete teacher error:",
                err
            );

            setError(
                err?.message ||
                "Unable to delete teacher"
            );
        } finally {
            setDeleting(false);
        }
    };

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {
        fetchTeachers();
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="teachers-page">

            {/* HEADER */}

            <div className="teachers-header">

                <div>
                    <h1>Teachers</h1>

                    <p>
                        Manage your school teachers
                    </p>
                </div>

                <div className="header-actions">

                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        {loading
                            ? "↻ Refreshing..."
                            : "↻ Refresh"}
                    </button>

                    <button
                        type="button"
                        className="add-teacher-btn"
                        onClick={openAddModal}
                    >
                        + Add Teacher
                    </button>

                </div>
            </div>

            {/* ERROR */}

            {error && (
                <div className="teachers-error">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>
                </div>
            )}

            {/* CARD */}

            <div className="teachers-card">

                {/* SEARCH */}

                <div className="teachers-toolbar">

                    <input
                        type="text"
                        className="teacher-search"
                        placeholder="Search teachers..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

                {/* TABLE */}

                <div className="teachers-table-container">

                    <table className="teachers-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Qualification</th>
                                <th>Specialization</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="table-message"
                                    >
                                        Loading teachers...
                                    </td>
                                </tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="table-message"
                                    >
                                        {search
                                            ? "No teachers found matching your search."
                                            : "No teachers found"}
                                    </td>
                                </tr>
                            ) : (
                                filteredTeachers.map(
                                    (teacher) => {

                                        const teacherId =
                                            getTeacherId(
                                                teacher
                                            );

                                        const status =
                                            getStatus(
                                                teacher
                                            );

                                        return (
                                            <tr
                                                key={
                                                    teacherId
                                                }
                                            >

                                                {/* NAME */}

                                                <td>
                                                    <strong>
                                                        {
                                                            getTeacherName(
                                                                teacher
                                                            )
                                                        }
                                                    </strong>
                                                </td>

                                                {/* EMAIL */}

                                                <td>
                                                    {
                                                        getEmail(
                                                            teacher
                                                        )
                                                    }
                                                </td>

                                                {/* PHONE */}

                                                <td>
                                                    {
                                                        getPhone(
                                                            teacher
                                                        )
                                                    }
                                                </td>

                                                {/* QUALIFICATION */}

                                                <td>
                                                    {
                                                        teacher?.qualification ||
                                                        "-"
                                                    }
                                                </td>

                                                {/* SPECIALIZATION */}

                                                <td>
                                                    {
                                                        teacher?.specialization ||
                                                        "-"
                                                    }
                                                </td>

                                                {/* STATUS */}

                                                <td>
                                                    <span
                                                        className={
                                                            status ===
                                                            "Active"
                                                                ? "status-badge active"
                                                                : "status-badge inactive"
                                                        }
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </span>
                                                </td>

                                                {/* ACTIONS */}

                                                <td className="actions-cell">

                                                    <div className="action-buttons">

                                                        <button
                                                            type="button"
                                                            className="view-btn"
                                                            onClick={() =>
                                                                openViewModal(
                                                                    teacher
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    teacher
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            disabled={
                                                                deleting
                                                            }
                                                            onClick={() =>
                                                                handleDeleteTeacher(
                                                                    teacher
                                                                )
                                                            }
                                                        >
                                                            {deleting
                                                                ? "Deleting..."
                                                                : "Delete"}
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

            {/* =====================================================
                VIEW / EDIT / ADD MODAL
            ===================================================== */}

            {showModal && (
                <div
                    className="modal-overlay"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div className="teacher-modal">

                        {/* HEADER */}

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {modalMode ===
                                    "view"
                                        ? "Teacher Details"
                                        : modalMode ===
                                            "edit"
                                            ? "Edit Teacher"
                                            : "Add Teacher"}
                                </h2>

                                <p>
                                    {modalMode ===
                                    "view"
                                        ? "View teacher information"
                                        : modalMode ===
                                            "edit"
                                            ? "Update teacher information"
                                            : "Create a new teacher"}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={closeModal}
                                disabled={
                                    saving ||
                                    deleting
                                }
                            >
                                ×
                            </button>

                        </div>

                        {/* VIEW */}

                        {modalMode ===
                        "view" ? (

                            <div className="teacher-details">

                                <div className="detail-item">
                                    <strong>
                                        First Name
                                    </strong>

                                    <span>
                                        {
                                            selectedTeacher?.firstName ||
                                            selectedTeacher?.user?.firstName ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <strong>
                                        Last Name
                                    </strong>

                                    <span>
                                        {
                                            selectedTeacher?.lastName ||
                                            selectedTeacher?.user?.lastName ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <strong>
                                        Email
                                    </strong>

                                    <span>
                                        {
                                            getEmail(
                                                selectedTeacher
                                            )
                                        }
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <strong>
                                        Phone
                                    </strong>

                                    <span>
                                        {
                                            getPhone(
                                                selectedTeacher
                                            )
                                        }
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <strong>
                                        Qualification
                                    </strong>

                                    <span>
                                        {
                                            selectedTeacher?.qualification ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <strong>
                                        Specialization
                                    </strong>

                                    <span>
                                        {
                                            selectedTeacher?.specialization ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <strong>
                                        Gender
                                    </strong>

                                    <span>
                                        {
                                            getGender(
                                                selectedTeacher
                                            )
                                        }
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <strong>
                                        Status
                                    </strong>

                                    <span
                                        className={
                                            getStatus(
                                                selectedTeacher
                                            ) ===
                                            "Active"
                                                ? "status-badge active"
                                                : "status-badge inactive"
                                        }
                                    >
                                        {
                                            getStatus(
                                                selectedTeacher
                                            )
                                        }
                                    </span>
                                </div>

                                <div className="detail-item full-width">
                                    <strong>
                                        Address
                                    </strong>

                                    <span>
                                        {
                                            getAddress(
                                                selectedTeacher
                                            )
                                        }
                                    </span>
                                </div>

                            </div>

                        ) : (

                            /* =================================================
                               ADD / EDIT FORM
                            ================================================= */

                            <form
                                onSubmit={
                                    modalMode ===
                                    "edit"
                                        ? handleUpdateTeacher
                                        : handleCreateTeacher
                                }
                            >

                                {error && (
                                    <div className="modal-error">
                                        {error}
                                    </div>
                                )}

                                <div className="form-grid">

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

                                    <div className="form-group">
                                        <label>
                                            Qualification
                                        </label>

                                        <input
                                            type="text"
                                            name="qualification"
                                            value={
                                                formData.qualification
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="B.Ed, M.Ed"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Specialization
                                        </label>

                                        <input
                                            type="text"
                                            name="specialization"
                                            value={
                                                formData.specialization
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Mathematics"
                                        />
                                    </div>

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

                                    <div className="form-group">
                                        <label>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                formData.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >
                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </div>

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
                                            : modalMode ===
                                                "edit"
                                                ? "Update Teacher"
                                                : "Create Teacher"}
                                    </button>

                                </div>

                            </form>
                        )}

                        {/* VIEW ACTIONS */}

                        {modalMode ===
                            "view" &&
                            selectedTeacher && (
                                <div className="modal-actions">

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={
                                            closeModal
                                        }
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="button"
                                        className="edit-btn"
                                        onClick={() =>
                                            openEditModal(
                                                selectedTeacher
                                            )
                                        }
                                    >
                                        Edit Teacher
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDeleteTeacher(
                                                selectedTeacher
                                            )
                                        }
                                        disabled={
                                            deleting
                                        }
                                    >
                                        {deleting
                                            ? "Deleting..."
                                            : "Delete Teacher"}
                                    </button>

                                </div>
                            )}

                    </div>
                </div>
            )}

        </div>
    );
}

export default Teachers;