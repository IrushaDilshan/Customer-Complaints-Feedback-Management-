const express = require('express');
const router = express.Router();
const FeedbackInviteController = require('../controllers/FeedbackInviteController'); // Make sure this path is correct

router.post('/session/:sessionId/invite', FeedbackInviteController.sendInvite);
router.post('/submit', FeedbackInviteController.submitFeedback);

module.exports = router;
