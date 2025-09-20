const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// Get all feedback
router.get("/", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
});

// Add feedback (user side)
router.post("/", async (req, res) => {
    try {
        const { username, email, message, rating } = req.body;
        const fb = new Feedback({ username, email, message, rating });
        await fb.save();
        res.json(fb);
    } catch (err) {
        res.status(400).json({ error: "Failed to add feedback" });
    }
});

// Update feedback (owner/admin)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { message, rating } = req.body;
        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ error: "Feedback not found" });

        if (typeof message === "string" && message.trim()) feedback.message = message;
        if (typeof rating === "number") feedback.rating = rating;
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: "Failed to update feedback" });
    }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete feedback" });
    }
});

// Add admin reply
router.post("/:id/reply", async (req, res) => {
    try {
        const { sender, message, email } = req.body;
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ error: "Feedback not found" });

        const reply = { sender, message };
        if (sender === "user" && email) reply.email = email;
        feedback.replies.push(reply);
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: "Failed to add reply" });
    }
});

// Edit reply (admin can edit admin replies; user can edit own replies)
router.put("/:feedbackId/reply/:replyId", async (req, res) => {
    try {
        const { message, requesterEmail } = req.body;
        const feedback = await Feedback.findById(req.params.feedbackId);
        if (!feedback) return res.status(404).json({ error: "Feedback not found" });

        const reply = feedback.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ error: "Reply not found" });

        // Authorization: admin edits admin replies; user edits only own reply by matching email
        if (reply.sender === "admin") {
            // allow
        } else if (reply.sender === "user") {
            if (!requesterEmail || reply.email !== requesterEmail) {
                return res.status(403).json({ error: "Not allowed to edit this reply" });
            }
        } else {
            return res.status(403).json({ error: "Not allowed" });
        }

        reply.message = message;
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: "Failed to edit reply" });
    }
});

// Delete reply (admin can delete admin replies; user can delete own replies)
router.delete("/:feedbackId/reply/:replyId", async (req, res) => {
    try {
        const { requesterEmail } = req.body || {};
        const feedback = await Feedback.findById(req.params.feedbackId);
        if (!feedback) return res.status(404).json({ error: "Feedback not found" });

        const reply = feedback.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ error: "Reply not found" });

        if (reply.sender === "admin") {
            // allow
        } else if (reply.sender === "user") {
            if (!requesterEmail || reply.email !== requesterEmail) {
                return res.status(403).json({ error: "Not allowed to delete this reply" });
            }
        } else {
            return res.status(403).json({ error: "Not allowed" });
        }

        reply.deleteOne();
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: "Failed to delete reply" });
    }
});

module.exports = router;
