// Request logging middleware
export const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Validation middleware for user creation
export const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Name and Email are required",
    });
  }

  // Name validation
  if (name.length < 2) {
    return res.status(400).json({
      error: "Name must be at least 2 characters long",
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      error: "Name cannot exceed 100 characters",
    });
  }

  // Email validation
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  next();
};


// UUID validation middleware
export const validateUUID = (req, res, next) => {
  const { user_id } = req.params;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(user_id)) {
    return res.status(400).json({
      error: "Invalid user ID format",
    });
  }

  next();
};
