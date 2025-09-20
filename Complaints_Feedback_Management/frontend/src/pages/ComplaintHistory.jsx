import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email] = useState(() => {
    try {
      return localStorage.getItem("complaintEmail") || "";
    } catch {
      return "";
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ category: "", description: "" });

  const canLoad = useMemo(() => email && email.includes("@"), [email]);

  const fetchComplaints = async () => {
    if (!canLoad) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/complaints", { params: { email } });
      setComplaints(res.data || []);
    } catch (e) {
      // fallback to localStorage if API fails
      try {
        const list = JSON.parse(localStorage.getItem("complaints") || "[]");
        setComplaints(list);
      } catch {
        setComplaints([]);
      }
      setError(e?.response?.data?.error || e.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canLoad]);

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({ category: c.category || "", description: c.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ category: "", description: "" });
  };

  const saveEdit = async (id) => {
    try {
      const payload = { email, category: editForm.category, description: editForm.description };
      const res = await axios.put(`/api/complaints/${id}`, payload);
      const updated = res.data?.complaint || null;
      if (updated) {
        setComplaints((prev) => prev.map((x) => (x._id === id ? updated : x)));
      }
      cancelEdit();
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to save changes");
    }
  };

  const deleteComplaint = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this complaint?");
    if (!ok) return;
    try {
      await axios.delete(`/api/complaints/${id}`, { data: { email } });
      setComplaints((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to delete complaint");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Complaint History</h2>

      {/* Email is read from localStorage; selector removed per requirements */}

      {loading && <p className="text-center">Loading complaints...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && complaints.length === 0 && (
        <p className="text-center text-gray-500">No complaints found.</p>
      )}

      {!loading && complaints.length > 0 && (
        <ul className="space-y-6">
          {complaints.map((c) => (
            <li
              key={c._id}
              className="border rounded-lg p-5 bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-blue-700">
                  Reference ID: {c.referenceId || "-"}
                </span>
                <span className="text-gray-500 text-sm">
                  Created:{" "}
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleString()
                    : "-"}
                </span>
              </div>

              <div className="mb-3 space-y-1 text-gray-700">
                <p>
                  <strong>Name:</strong> {c.name || c.customer?.name || "-"}
                </p>
                <p>
                  <strong>Email:</strong> {c.email || c.customer?.email || "-"}
                </p>
                {editingId === c._id ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-600">Category</label>
                      <select
                        className="border rounded p-2"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        <option value="delay">Delay</option>
                        <option value="officer_behavior">Officer Behavior</option>
                        <option value="technical_issue">Technical Issue</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-600">Description</label>
                      <textarea
                        className="border rounded p-2"
                        rows={3}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Category:</strong> {c.category || "-"}
                    </p>
                    <p>
                      <strong>Description:</strong> {c.description || "-"}
                    </p>
                  </>
                )}
                <p>
                  <strong>Current Status:</strong> {c.status || "Pending"}
                </p>
                {c.responseNotes && (
                  <p>
                    <strong>Response:</strong> {c.responseNotes}
                  </p>
                )}
              </div>

              {c.updatedAt && (
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(c.updatedAt).toLocaleString()}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                {editingId === c._id ? (
                  <>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => saveEdit(c._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => startEdit(c)}
                      disabled={!canLoad}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deleteComplaint(c._id)}
                      disabled={!canLoad}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComplaintHistory;
