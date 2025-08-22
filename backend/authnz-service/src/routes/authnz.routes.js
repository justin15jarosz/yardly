import express from 'express';
import { checkPermission, getUserPermissions } from '../controller/authnz.controller.js';
import { authenticateToken, authorizePermission, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Check specific permission
router.get('/permission/:permission', authenticateToken, checkPermission);

// Get user permissions
router.get('/permissions', authenticateToken, getUserPermissions);

// Example protected routes with different authorization levels
router.get('/admin-only', 
  authenticateToken, 
  authorizeRole(['admin']), 
  (req, res) => {
    res.json({ success: true, message: 'Admin access granted', user: req.user });
  }
);

router.get('/read-access', 
  authenticateToken, 
  authorizePermission(['read']), 
  (req, res) => {
    res.json({ success: true, message: 'Read access granted', user: req.user });
  }
);

router.post('/write-access', 
  authenticateToken, 
  authorizePermission(['write', 'admin']), 
  (req, res) => {
    res.json({ success: true, message: 'Write access granted', user: req.user });
  }
);

router.delete('/delete-access', 
  authenticateToken, 
  authorizePermission(['delete', 'admin']), 
  (req, res) => {
    res.json({ success: true, message: 'Delete access granted', user: req.user });
  }
);

export default router;