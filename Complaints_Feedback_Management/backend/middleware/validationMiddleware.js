const { body } = require("express-validator");

module.exports.complaintValidation = [
    body("description").notEmpty().withMessage("Description is required"),
    body("category").isIn(["delay", "officer_behavior", "technical_issue", "other"]).withMessage("Invalid category"),
];

module.exports.feedbackValidation = [
    body("username").notEmpty().withMessage("Username is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
];
