// FeedbackController.js
const Feedback = require('../models/Feedback');

// Update Feedback (Admin only) - Express handler
const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, rating } = req.body;
        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

        // TODO: plug real auth/role check. For now, allow.
        if (typeof message === 'string' && message.trim()) feedback.message = message;
        if (typeof rating === 'number') feedback.rating = rating;
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Failed to update feedback' });
    }
};

// Delete Feedback (Admin only) - Express handler
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const fb = await Feedback.findByIdAndDelete(id);
        if (!fb) return res.status(404).json({ error: 'Feedback not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message || 'Failed to delete feedback' });
    }
};

// Add Reply (Admin only) - Express handler
const addReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { sender, message } = req.body;
        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
        feedback.replies.push({ sender, message });
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Failed to add reply' });
    }
};

module.exports = { updateFeedback, deleteFeedback, addReply };
