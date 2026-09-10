const express = require('express');
const resumeController = require('../controllers/resumeController');
const { requireAuth } = require('../middleware/authMiddleware');
const { handleResumeUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// All resume/report endpoints require authentication.
router.use(requireAuth);

router.post('/upload', handleResumeUpload, resumeController.uploadResume);
router.post('/analyze', resumeController.analyzeResume);
router.get('/history', resumeController.getHistory);
router.get('/:id', resumeController.getReportById);
router.delete('/:id', resumeController.deleteReportById);

module.exports = router;
