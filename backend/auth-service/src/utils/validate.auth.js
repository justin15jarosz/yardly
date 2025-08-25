// Validate Passwords
export const validatePasswords = (req, res, next) => {
  const { password1, password2 } = req.body;

  if (!password1 || !password2) {
    return res.status(400).json({
      error: "Password is required",
    });
  }

  if (password1 !== password2) {
    return res.status(400).json({
      error: "Passwords do not match",
    });
  }

  // Password validation
  if (password1.length < 6 || password2.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long",
    });
  }

  next();
};

// Validate Email
export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Email is required",
    });
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  next();
}

// Validation middleware for user login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  next();
};