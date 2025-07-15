import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().email().required()
});

export const eventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  date_time: Joi.string().isoDate().required(),
  location: Joi.string().trim().min(3).max(255).required(),
  capacity: Joi.number().integer().min(1).max(1000).required()
});

export const registrationSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  eventId: Joi.number().integer().positive().required()
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters',
        details: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }
    
    next();
  };
};