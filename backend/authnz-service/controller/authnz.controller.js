const checkPermission = (req, res) => {
  try {
    const { permission } = req.params;
    const userPermissions = req.user.permissions || [];
    
    const hasPermission = userPermissions.includes(permission);
    
    res.json({
      success: true,
      data: {
        hasPermission,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          permissions: userPermissions
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getUserPermissions = (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          permissions: req.user.permissions || []
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  checkPermission,
  getUserPermissions
};