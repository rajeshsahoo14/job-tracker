const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const sendEmail = require('../utils/email');

// @route   GET /api/jobs
// @desc    Get all jobs (filtered for applicant, all for admin)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, sortBy, search } = req.query;
    
    // Build query
    let query = {};
    
    // If applicant, only show their jobs
    if (req.user.role === 'applicant') {
      query.user = req.user._id;
    }
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort
    let sortOption = {};
    switch (sortBy) {
      case 'newest':
        sortOption = { appliedDate: -1 };
        break;
      case 'oldest':
        sortOption = { appliedDate: 1 };
        break;
      case 'company':
        sortOption = { company: 1 };
        break;
      default:
        sortOption = { appliedDate: -1 };
    }
    
    const jobs = await Job.find(query)
      .sort(sortOption)
      .populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/jobs/stats
// @desc    Get job statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const query = req.user.role === 'applicant' ? { user: req.user._id } : {};
    
    const stats = await Job.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await Job.countDocuments(query);
    
    const formattedStats = {
      total,
      byStatus: {}
    };
    
    stats.forEach(stat => {
      formattedStats.byStatus[stat._id] = stat.count;
    });
    
    res.status(200).json({
      success: true,
      stats: formattedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('user', 'name email');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check ownership for applicants
    if (req.user.role === 'applicant' && job.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this job'
      });
    }
    
    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/jobs
// @desc    Create new job application
// @access  Private
router.post('/', [
  protect,
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('role').trim().notEmpty().withMessage('Job role is required'),
  body('status').optional().isIn(['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'])
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const jobData = {
      ...req.body,
      user: req.user._id
    };
    
    const job = await Job.create(jobData);
    
    // Send email notification
    const emailHtml = `
      <h2>New Job Application Added</h2>
      <p>Hi ${req.user.name},</p>
      <p>You've successfully added a new job application:</p>
      <ul>
        <li><strong>Company:</strong> ${job.company}</li>
        <li><strong>Role:</strong> ${job.role}</li>
        <li><strong>Status:</strong> ${job.status}</li>
        <li><strong>Applied Date:</strong> ${job.appliedDate.toLocaleDateString()}</li>
      </ul>
      <p>Good luck with your application!</p>
    `;
    
    await sendEmail({
      email: req.user.email,
      subject: 'New Job Application Added',
      html: emailHtml
    });
    
    // Emit socket event for real-time notification
    if (req.app.io) {
      req.app.io.to(req.user._id.toString()).emit('jobAdded', {
        message: `New job application added: ${job.company} - ${job.role}`,
        job
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Job application created successfully',
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job application
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check ownership for applicants
    if (req.user.role === 'applicant' && job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }
    
    const oldStatus = job.status;
    const newStatus = req.body.status;
    
    // Update job
    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    // If status changed, add to history and send notification
    if (oldStatus !== newStatus && newStatus) {
      job.statusHistory.push({
        status: newStatus,
        date: new Date(),
        notes: req.body.notes || ''
      });
      await job.save();
      
      // Send email notification
      const emailHtml = `
        <h2>Job Application Status Updated</h2>
        <p>Hi ${job.user.name},</p>
        <p>Your job application status has been updated:</p>
        <ul>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Role:</strong> ${job.role}</li>
          <li><strong>Previous Status:</strong> ${oldStatus}</li>
          <li><strong>New Status:</strong> ${newStatus}</li>
        </ul>
        ${req.body.notes ? `<p><strong>Notes:</strong> ${req.body.notes}</p>` : ''}
      `;
      
      await sendEmail({
        email: job.user.email,
        subject: 'Job Application Status Updated',
        html: emailHtml
      });
      
      // Emit socket event
      if (req.app.io) {
        req.app.io.to(job.user._id.toString()).emit('jobUpdated', {
          message: `Job status updated: ${job.company} - ${job.role} is now ${newStatus}`,
          job
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Job application updated successfully',
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job application
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check ownership for applicants
    if (req.user.role === 'applicant' && job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Job application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;