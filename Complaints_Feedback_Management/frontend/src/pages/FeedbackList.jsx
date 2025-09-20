import React, { useEffect, useState } from "react";
import axios from "axios";

// Component to show feedback list, allow editing, deleting, and replying
export default function FeedbackList({ onBack }) {
    // State for feedback items
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error message
    const [replyTexts, setReplyTexts] = useState({}); // Track reply input per feedback
    const [editing, setEditing] = useState({}); // Track editing state {id: {message, rating}}
    const [replyEditing, setReplyEditing] = useState({}); // Track reply editing {replyId: {feedbackId, message}}

    // Get logged-in user email from localStorage
    const myEmail = (() => {
        try { return localStorage.getItem("feedbackEmail") || ""; } catch { return ""; }
    })();

    // Fetch feedback data from backend
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get("http://localhost:5000/feedback");
            // Ensure response is an array
            setItems(Array.isArray(res.data) ? res.data : res.data?.data || []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Failed to load feedback");
        } finally {
            setLoading(false);
        }
    };

    // Run fetchData when component loads
    useEffect(() => {
        fetchData();
    }, []);

    // Submit a reply to feedback
    const submitReply = async (feedbackId) => {
        const content = replyTexts[feedbackId]?.trim();
        if (!content) return; // Skip if empty
        try {
            await axios.post(`http://localhost:5000/feedback/${feedbackId}/reply`, {
                sender: "user",
                message: content,
                email: myEmail || undefined,
            });
            // Clear input after sending reply
            setReplyTexts((r) => ({ ...r, [feedbackId]: "" }));
            fetchData(); // Refresh feedback list
        } catch (e) {
            alert(e?.response?.data?.message || e.message || "Failed to submit reply");
        }
    };

    // Start editing a reply
    const startEditReply = (feedbackId, reply) => {
        setReplyEditing((s) => ({ ...s, [reply._id || reply.id]: { feedbackId, message: reply.message || "" } }));
    };

    // Cancel editing a reply
    const cancelEditReply = (replyId) => {
        setReplyEditing((s) => {
            const copy = { ...s };
            delete copy[replyId];
            return copy;
        });
    };

    // Save edited reply
    const saveEditReply = async (replyId) => {
        const edit = replyEditing[replyId];
        if (!edit) return;
        const msg = (edit.message || "").trim();
        if (!msg) return alert("Reply message cannot be empty");
        try {
            await axios.put(`http://localhost:5000/feedback/${edit.feedbackId}/reply/${replyId}`, {
                message: msg,
                requesterEmail: myEmail || undefined,
            });
            cancelEditReply(replyId);
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.error || e.message || "Failed to save reply");
        }
    };

    // Delete reply
    const deleteReply = async (feedbackId, replyId) => {
        if (!confirm("Delete this reply?")) return;
        try {
            await axios.delete(`http://localhost:5000/feedback/${feedbackId}/reply/${replyId}`, {
                data: { requesterEmail: myEmail || undefined },
            });
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.error || e.message || "Failed to delete reply");
        }
    };

    // Enable editing for a feedback item
    const startEdit = (fb) => {
        const fid = fb._id || fb.id;
        setEditing((e) => ({ ...e, [fid]: { message: fb.message, rating: fb.rating || 0 } }));
    };

    // Cancel editing
    const cancelEdit = (id) => {
        setEditing((e) => {
            const copy = { ...e };
            delete copy[id]; // Remove from editing state
            return copy;
        });
    };

    // Save edited feedback
    const saveEdit = async (id) => {
        const data = editing[id];
        if (!data || !data.message?.trim()) return; // Skip if invalid
        try {
            const payload = { message: data.message };
            // Add rating if valid (1–5)
            if (data.rating && data.rating >= 1 && data.rating <= 5) payload.rating = data.rating;
            await axios.put(`http://localhost:5000/feedback/${id}`, payload);
            cancelEdit(id);
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.error || e.message || "Failed to update feedback");
        }
    };

    // Delete a feedback item
    const deleteFeedback = async (id) => {
        if (!confirm("Delete this feedback?")) return;
        try {
            await axios.delete(`http://localhost:5000/feedback/${id}`);
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.error || e.message || "Failed to delete feedback");
        }
    };



    // Show loading screen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading feedback…</div>
            </div>
        );
    }

    // Show error screen
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
                    {error}
                </div>
            </div>
        );
    }

    // Main UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Feedback & Replies</h1>
                        <p className="text-gray-500 text-sm">See what others said and join the discussion.</p>
                    </div>
                    {onBack && (
                        <button onClick={onBack} className="text-blue-600 hover:underline">Submit new</button>
                    )}
                </div>

                {/* Feedback list */}
                <div className="space-y-4">
                    {/* Show if no feedback */}
                    {items.length === 0 && (
                        <div className="bg-white border rounded-xl p-6 text-center text-gray-600">No feedback yet.</div>
                    )}

                    {/* Loop through feedback items */}
                    {items.map((fb) => {
                        const fid = fb._id || fb.id;
                        return (
                            <div key={fid} className="bg-white border rounded-xl p-5 shadow-sm">
                                {/* Feedback header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-semibold">{fb.username || fb.fullName || "Anonymous"}</div>
                                        <div className="text-gray-500 text-sm">{fb.email}</div>
                                    </div>
                                    {/* Rating stars */}
                                    {typeof fb.rating === "number" && (
                                        <div className="text-yellow-500">
                                            {Array.from({ length: fb.rating || 0 }).map((_, i) => (
                                                <span key={i}>⭐</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Edit mode */}
                                {editing[fid] ? (
                                    <div className="mt-3 space-y-2">
                                        {/* Editable text area */}
                                        <textarea
                                            className="w-full border rounded-lg p-2"
                                            rows={3}
                                            value={editing[fid].message}
                                            onChange={(e) => setEditing((s) => ({ ...s, [fid]: { ...s[fid], message: e.target.value } }))}
                                        />
                                        {/* Rating select */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Rating:</span>
                                            <select
                                                className="border rounded-lg px-2 py-1"
                                                value={editing[fid].rating}
                                                onChange={(e) => setEditing((s) => ({ ...s, [fid]: { ...s[fid], rating: Number(e.target.value) } }))}
                                            >
                                                <option value={0}>Keep</option>
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                        {/* Save / Cancel buttons */}
                                        <div className="flex gap-2">
                                            <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg" onClick={() => saveEdit(fid)}>Save</button>
                                            <button className="px-3 py-2 border rounded-lg" onClick={() => cancelEdit(fid)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-gray-800">{fb.message}</p>
                                )}

                                {/* Owner controls (only show for user's own feedback) */}
                                {myEmail && fb.email === myEmail && !editing[fid] && (
                                    <div className="mt-2 flex gap-3 text-sm">
                                        <button className="text-blue-600 hover:underline" onClick={() => startEdit(fb)}>Edit</button>
                                        <button className="text-red-600 hover:underline" onClick={() => deleteFeedback(fid)}>Delete</button>
                                    </div>
                                )}

                                {/* Replies */}
                                {(fb.replies && fb.replies.length > 0) && (
                                    <div className="mt-4 space-y-2">
                                        {fb.replies.map((r) => {
                                            const rid = r._id || r.id;
                                            const canEdit = r.sender === "user" && myEmail && r.email === myEmail;
                                            return (
                                                <div key={rid} className="bg-gray-50 border rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="text-sm text-gray-600">
                                                            {r.sender === "admin" ? (
                                                                <span className="font-medium text-blue-700">Admin</span>
                                                            ) : (
                                                                <span className="font-medium">User</span>
                                                            )}
                                                        </div>
                                                        {canEdit && !replyEditing[rid] && (
                                                            <div className="text-xs flex gap-3">
                                                                <button className="text-blue-600 hover:underline" onClick={() => startEditReply(fid, r)}>Edit</button>
                                                                <button className="text-red-600 hover:underline" onClick={() => deleteReply(fid, rid)}>Delete</button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {replyEditing[rid] ? (
                                                        <div className="space-y-2">
                                                            <textarea
                                                                className="w-full border rounded p-2"
                                                                rows={2}
                                                                value={replyEditing[rid].message}
                                                                onChange={(e) => setReplyEditing((s) => ({ ...s, [rid]: { ...s[rid], message: e.target.value } }))}
                                                            />
                                                            <div className="flex gap-2">
                                                                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={() => saveEditReply(rid)}>Save</button>
                                                                <button className="px-3 py-1.5 border rounded" onClick={() => cancelEditReply(rid)}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-800">{r.message}</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Add reply input */}
                                <div className="mt-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={replyTexts[fid] || ""}
                                            onChange={(e) =>
                                                setReplyTexts((r) => ({ ...r, [fid]: e.target.value }))
                                            }
                                            placeholder="Write a reply…"
                                            className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                        />
                                        <button
                                            onClick={() => submitReply(fid)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
