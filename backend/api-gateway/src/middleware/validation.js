import Joi from 'joi';

// Request validation schemas
export const validationSchemas = {
  'POST /api/auth/login': Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  'POST /api/users': Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('admin', 'user').default('user')
  }),
  
  'PUT /api/users/:id': Joi.object({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(50),
    role: Joi.string().valid('admin', 'user')
  }).min(1)
};

export const validateRequest = (req, res, next) => {
  const routeKey = `${req.method} ${req.route?.path || req.path}`;
  const schema = validationSchemas[routeKey];

  if (!schema) {
    return next(); // No validation schema defined, skip validation
  }

  const { error, value } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.body = value; // Use validated and sanitized data
  next();
};

// Query parameter validation
export const validateQueryParams = (req, res, next) => {
  const commonQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().regex(/^[a-zA-Z_]+:(asc|desc)$/),
    search: Joi.string().max(100)
  }).unknown(true);

  const { error, value } = commonQuerySchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.query = value;
  next();
};