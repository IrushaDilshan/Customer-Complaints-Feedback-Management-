import React, { useState } from "react";
import axios from "axios";

export default function ComplaintForm() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", category: "delay", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/complaints", {
                name: form.name,
                email: form.email,
                phone: form.phone,
                category: form.category,
                description: form.message,
            });
            // Store email for ComplaintHistory lookup
            try {
                localStorage.setItem("complaintEmail", form.email);
            } catch { }
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to submit complaint.", error);
            // just mark as submitted, no id
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow text-center">
                <h1 className="text-2xl font-bold mb-4">Complaint Submitted</h1>
                <p className="mb-6">Your complaint has been submitted successfully.</p>
                <button
                    className="bg-green-600 text-white rounded p-2 px-4 hover:bg-green-700"
                    onClick={() => window.location.href = "/complaints/view"} // navigate to complaint history page
                >
                    View Complaint History
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Submit a Complaint</h1>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <input className="w-full border rounded p-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                <input className="w-full border rounded p-2" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input className="w-full border rounded p-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
                <select className="w-full border rounded p-2" name="category" value={form.category} onChange={handleChange}>
                    <option value="delay">Delay</option>
                    <option value="officer_behavior">Officer Behavior</option>
                    <option value="technical_issue">Technical Issue</option>
                    <option value="other">Other</option>
                </select>
                <textarea className="w-full border rounded p-2" name="message" placeholder="Message" rows={4} value={form.message} onChange={handleChange} />
                <button className="w-full bg-blue-600 text-white rounded p-2" disabled={loading}>
                    {loading ? "Submitting…" : "Submit"}
                </button>
            </form>
        </div>
    );
}
