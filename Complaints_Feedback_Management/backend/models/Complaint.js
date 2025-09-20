const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    referenceId: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            // Generate a stable unique ID
            return `NITF-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
        }
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    category: String,
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "in-progress", "resolved", "escalated"], default: "pending" },
    responseNotes: String,
    branch: String,
    logs: [
        {
            actor: String,
            action: String,
            note: String,
            at: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", complaintSchema);
