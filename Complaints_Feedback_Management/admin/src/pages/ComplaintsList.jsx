import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const http = axios.create();

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await http.get("/api/complaints");
      setComplaints(res.data || []);
    } catch {
      const list = JSON.parse(localStorage.getItem("complaints") || "[]");
      setComplaints(list);
      if (!list.length) setError("No complaints found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = statusFilter
    ? complaints.filter(c => c.status === statusFilter)
    : complaints;

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this complaint?");
    if (!ok) return;
    try {
      // Admin-side delete: no email required by admin endpoint; using public one requires owner email which admin may not have
      await http.delete(`/api/complaints/${id}`, { data: {} });
      setComplaints(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to delete complaint");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading complaints…</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>

      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Filter by Status:</label>
        <select
          className="border rounded p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Reference ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Submitted</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="p-3 text-blue-600 font-medium">
                    <Link to={`/admin/complaints/${c._id}`}>
                      {c.referenceId || "-"}
                    </Link>
                  </td>
                  <td className="p-3">{c.customer?.name || c.name || "-"}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3 capitalize">{c.status}</td>
                  <td className="p-3">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
