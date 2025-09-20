const express = require('express');
const router = express.Router();
const ComplaintController = require('../controllers/ComplaintController');
const Complaint = require('../models/Complaint');

// Create a new complaint
router.post('/', ComplaintController.createComplaint);

// Update complaint status/response
router.put('/:id/status', ComplaintController.updateComplaintStatus);

// Get all complaints
// Supports optional filtering by ?email=foo@example.com for user-specific history
router.get('/', ComplaintController.getAllComplaints);

// Get complaint by referenceId (use /ref/:referenceId to avoid conflict)
router.get('/ref/:referenceId', ComplaintController.getComplaintByReferenceId);

// Get complaint by Mongo _id (placed after /ref to avoid route shadowing)
router.get('/:id', ComplaintController.getComplaintById);

router.post('/:id/respond', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { response: req.body.response },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public endpoints for editing/deleting a complaint by its owner (email must match)
router.put('/:id', ComplaintController.updateComplaintPublic);
router.delete('/:id', ComplaintController.deleteComplaintPublic);

module.exports = router;
