import Registration from '../models/Registration.js';

export const registerForEvent = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    
    if (!userId || !eventId) {
      return res.status(400).json({
        success: false,
        error: 'userId and eventId are required'
      });
    }
    
    const registration = await Registration.create(userId, eventId);
    
    res.status(201).json({
      success: true,
      data: registration,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    
    if (!userId || !eventId) {
      return res.status(400).json({
        success: false,
        error: 'userId and eventId are required'
      });
    }
    
    await Registration.cancel(userId, eventId);
    
    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRegistrations = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const registrations = await Registration.findByUser(userId);
    
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    next(error);
  }
};

export const getEventRegistrations = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.findByEvent(eventId);
    
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    next(error);
  }
};