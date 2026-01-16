const express = require('express');
const router = express.Router();
const { getAdminDashboard, deleteUser, seedJobs } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAdminDashboard);
router.post('/users/:id/delete', deleteUser);
router.post('/seed-jobs', seedJobs);

module.exports = router;
