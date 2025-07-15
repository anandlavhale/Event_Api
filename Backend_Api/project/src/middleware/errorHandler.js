import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  
  // Handle specific errors
  if (err.message === 'User not found' || err.message === 'Event not found') {
    statusCode = 404;
    message = err.message;
  } else if (
    err.message === 'User with this email already exists' ||
    err.message === 'User is already registered for this event' ||
    err.message === 'Event is full' ||
    err.message === 'Cannot register for past events' ||
    err.message === 'Registration not found'
  ) {
    statusCode = 400;
    message = err.message;
  } else if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};