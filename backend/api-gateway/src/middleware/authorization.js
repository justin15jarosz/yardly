const checkPermissions = (requiredPermissions = []) => {
  return (req, res, next) => {
    if (requiredPermissions.length === 0) {
      return next();
    }

    const userPermissions = req.user?.permissions || [];
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permissions: ${requiredPermissions.join(' or ')}`
      });
    }

    next();
  };
};

const checkRoles = (requiredRoles = []) => {
  return (req, res, next) => {
    if (requiredRoles.length === 0) {
      return next();
    }

    const userRole = req.user?.role;
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${requiredRoles.join(' or ')}`
      });
    }

    next();
  };
};

const checkOwnership = (req, res, next) => {
  const userId = req.params.id;
  const currentUserId = req.user?.id;

  // If user is admin, allow access
  if (req.user?.role === 'admin' || req.user?.permissions?.includes('admin')) {
    return next();
  }

  // If user is accessing their own resource
  if (userId && currentUserId && parseInt(userId) === parseInt(currentUserId)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only access your own resources.'
  });
};

module.exports = { checkPermissions, checkRoles, checkOwnership };