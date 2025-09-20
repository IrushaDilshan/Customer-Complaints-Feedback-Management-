import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ComplaintDetails = () => {
  // Route is defined as /admin/complaints/:ref in App.jsx
  // We pass Mongo _id as :ref from the list page
  const { ref } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/complaints/${ref}`)
      .then(res => res.json())
      .then(data => {
        setComplaint(data);
        setResponse(data.responseNotes || '');
        setStatus(data.status || 'pending');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ref]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/complaints/${complaint._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseNotes: response, status }),
    });
    alert('Response submitted!');
    navigate('/admin/complaints');
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!complaint) return <div className="p-6 text-center text-red-600">Complaint not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Complaint Details</h2>

      <div className="mb-6 space-y-2">
        <p><span className="font-semibold">Reference ID:</span> {complaint.referenceId}</p>
        <p><span className="font-semibold">Name:</span> {complaint.customer?.name || complaint.name || '-'}</p>
        <p><span className="font-semibold">Email:</span> {complaint.customer?.email || complaint.email || '-'}</p>
        <p><span className="font-semibold">Category:</span> {complaint.category}</p>
        <p><span className="font-semibold">Description:</span> {complaint.description}</p>
        <p><span className="font-semibold">Current Status:</span> {complaint.status}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Update Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Admin Response</label>
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your response here..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Response
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintDetails;
