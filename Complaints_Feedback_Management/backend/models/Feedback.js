const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    sender: { type: String, required: true }, // "admin" or "user"
    message: { type: String, required: true },
    // Optional email of the user when sender === "user"; not required for admin replies
    email: { type: String },
}, { timestamps: true });

const FeedbackSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    replies: [ReplySchema],
}, { timestamps: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);
