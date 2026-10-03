import React, { useEffect, useMemo, useState } from "react";
import "./Classes.css";

const API_URL = "http://localhost:5000/api/classes";

const emptyForm = {
    className: "",
    classCode: "",
    description: "",
    grade: "",
    academicYear: "",
    isActive: true,
};

function Classes() {
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(API_URL);
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || "Failed to fetch classes");

            const list = Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data?.result)
                    ? data.result
                    : Array.isArray(data?.classes)
                        ? data.classes
                        : Array.isArray(data)
                            ? data
                            : [];
            setClasses(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Fetch classes error:", err);
            setClasses([]);
            setError(err?.message || "Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const filteredClasses = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return classes;
        return classes.filter((item) =>
            [item?.className, item?.classCode, item?.academicYear, item?.grade]
                .some((v) => String(v ?? "").toLowerCase().includes(value))
        );
    }, [classes, search]);

    const activeCount = classes.filter((item) => item?.isActive !== false).length;
    const inactiveCount = classes.filter((item) => item?.isActive === false).length;
    const totalStudents = classes.reduce((n, item) => n + (Array.isArray(item?.students) ? item.students.length : 0), 0);
    const totalTeachers = classes.reduce((n, item) => n + (Array.isArray(item?.teachers) ? item.teachers.length : 0), 0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ ...emptyForm });
        setError("");
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingId(item?._id || item?.id || null);
        setFormData({
            className: item?.className || "",
            classCode: item?.classCode || "",
            description: item?.description || "",
            grade: item?.grade ?? "",
            academicYear: item?.academicYear || "",
            isActive: item?.isActive !== false,
        });
        setError("");
        setShowViewModal(false);
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
        setEditingId(null);
        setFormData({ ...emptyForm });
    };

    const openViewModal = (item) => {
        setSelectedClass(item);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setSelectedClass(null);
        setShowViewModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.className.trim()) return setError("Class name is required");
        if (!formData.classCode.trim()) return setError("Class code is required");

        try {
            setSaving(true);
            setError("");
            const isEditing = Boolean(editingId);
            const payload = {
                className: formData.className.trim(),
                classCode: formData.classCode.trim().toUpperCase(),
                description: formData.description.trim(),
                grade: formData.grade === "" ? null : Number(formData.grade),
                academicYear: formData.academicYear.trim(),
                isActive: formData.isActive,
            };

            const response = await fetch(isEditing ? `${API_URL}/${editingId}` : API_URL, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || "Unable to save class");

            closeModal();
            await fetchClasses();
        } catch (err) {
            console.error("Save class error:", err);
            setError(err?.message || "Unable to save class");
        } finally {
            setSaving(false);
        }
    };

    const updateClassStatus = async (item) => {
        const id = item?._id || item?.id;
        if (!id) return setError("Class ID is missing");
        const active = item?.isActive !== false;

        try {
            setError("");
            const response = await fetch(`${API_URL}/${id}/${active ? "deactivate" : "activate"}`, {
                method: "PATCH",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || "Failed to update class status");
            closeViewModal();
            await fetchClasses();
        } catch (err) {
            console.error("Class status error:", err);
            setError(err?.message || "Unable to update class status");
        }
    };

    const deleteClass = async (item) => {
        const id = item?._id || item?.id;
        if (!id) return setError("Class ID is missing");
        if (!window.confirm(`Are you sure you want to delete "${item?.className || "this class"}"?`)) return;

        try {
            setError("");
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || "Failed to delete class");
            closeViewModal();
            await fetchClasses();
        } catch (err) {
            console.error("Delete class error:", err);
            setError(err?.message || "Unable to delete class");
        }
    };

    const count = (value) => Array.isArray(value) ? value.length : 0;

    return (
        <div className="classes-page">
            <div className="classes-header">
                <div>
                    <h1>Classes</h1>
                    <p>Manage school classes and academic information.</p>
                </div>
                <button type="button" className="add-btn" onClick={openAddModal}>+ Add Class</button>
            </div>

            {error && (
                <div className="error-message">
                    <span>{error}</span>
                    <button type="button" onClick={() => setError("")}>×</button>
                </div>
            )}

            <div className="class-stats">
                <div className="stat-card"><span>Total Classes</span><strong>{classes.length}</strong></div>
                <div className="stat-card"><span>Active Classes</span><strong>{activeCount}</strong></div>
                <div className="stat-card"><span>Inactive Classes</span><strong>{inactiveCount}</strong></div>
                <div className="stat-card"><span>Total Students</span><strong>{totalStudents}</strong></div>
                <div className="stat-card"><span>Total Teachers</span><strong>{totalTeachers}</strong></div>
            </div>

            <div className="classes-toolbar">
                <input
                    type="text"
                    placeholder="Search by class name, code, grade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="button" className="refresh-btn" onClick={fetchClasses} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <div className="classes-table-container">
                {loading ? (
                    <div className="empty-state">Loading classes...</div>
                ) : filteredClasses.length === 0 ? (
                    <div className="empty-state">
                        <h3>No classes found</h3>
                        <p>{search ? "Try a different search." : "Create your first class."}</p>
                        {!search && <button type="button" className="add-btn" onClick={openAddModal}>+ Add Class</button>}
                    </div>
                ) : (
                    <table className="classes-table">
                        <thead>
                            <tr>
                                <th>CLASS</th><th>CODE</th><th>GRADE</th><th>ACADEMIC YEAR</th>
                                <th>STUDENTS</th><th>TEACHERS</th><th>STATUS</th><th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map((item, index) => {
                                const id = item?._id || item?.id;
                                const active = item?.isActive !== false;
                                return (
                                    <tr key={id || `${item?.classCode}-${index}`}>
                                        <td>
                                            <div className="class-name-cell">
                                                <strong>{item?.className || "-"}</strong>
                                                {item?.description && <small>{item.description}</small>}
                                            </div>
                                        </td>
                                        <td>{item?.classCode || "-"}</td>
                                        <td>{item?.grade ?? "-"}</td>
                                        <td>{item?.academicYear || "-"}</td>
                                        <td>{count(item?.students)}</td>
                                        <td>{count(item?.teachers)}</td>
                                        <td><span className={active ? "status-badge active" : "status-badge inactive"}>{active ? "Active" : "Inactive"}</span></td>
                                        <td>
                                            <div className="action-buttons">
                                                <button type="button" onClick={() => openViewModal(item)}>View</button>
                                                <button type="button" onClick={() => openEditModal(item)}>Edit</button>
                                                <button type="button" onClick={() => updateClassStatus(item)}>{active ? "Deactivate" : "Activate"}</button>
                                                <button type="button" className="delete-action" onClick={() => deleteClass(item)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="class-modal">
                        <div className="modal-header">
                            <div><h2>{editingId ? "Edit Class" : "Add Class"}</h2><p>{editingId ? "Update class information." : "Create a new school class."}</p></div>
                            <button type="button" className="close-btn" onClick={closeModal} disabled={saving}>×</button>
                        </div>
                        {error && <div className="modal-error">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group"><label>Class Name *</label><input name="className" value={formData.className} onChange={handleChange} placeholder="e.g. Class 10 A" required /></div>
                                <div className="form-group"><label>Class Code *</label><input name="classCode" value={formData.classCode} onChange={handleChange} placeholder="e.g. 10A" maxLength={10} required /></div>
                                <div className="form-group"><label>Grade</label><input type="number" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g. 10" min="1" max="12" /></div>
                                <div className="form-group"><label>Academic Year</label><input name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="2026-27" maxLength={10} /></div>
                                <div className="form-group full-width"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter class description..." rows="4" maxLength={500} /></div>
                                <div className="form-group checkbox-group full-width"><label><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /><span>Class is active</span></label></div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeModal} disabled={saving}>Cancel</button>
                                <button type="submit" className="save-btn" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Class" : "Create Class"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showViewModal && selectedClass && (
                <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeViewModal()}>
                    <div className="class-modal view-modal">
                        <div className="modal-header">
                            <div><h2>{selectedClass?.className || "Class"}</h2><p>Class details</p></div>
                            <button type="button" className="close-btn" onClick={closeViewModal}>×</button>
                        </div>
                        <div className="class-details">
                            <div><strong>Class Code</strong><span>{selectedClass?.classCode || "-"}</span></div>
                            <div><strong>Grade</strong><span>{selectedClass?.grade ?? "-"}</span></div>
                            <div><strong>Academic Year</strong><span>{selectedClass?.academicYear || "-"}</span></div>
                            <div><strong>Students</strong><span>{count(selectedClass?.students)}</span></div>
                            <div><strong>Teachers</strong><span>{count(selectedClass?.teachers)}</span></div>
                            <div><strong>Status</strong><span>{selectedClass?.isActive !== false ? "Active" : "Inactive"}</span></div>
                            <div className="description-detail"><strong>Description</strong><span>{selectedClass?.description || "No description"}</span></div>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={closeViewModal}>Close</button>
                            <button type="button" className="save-btn" onClick={() => openEditModal(selectedClass)}>Edit Class</button>
                            <button type="button" className="status-btn" onClick={() => updateClassStatus(selectedClass)}>{selectedClass?.isActive !== false ? "Deactivate" : "Activate"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Classes;
