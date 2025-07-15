import Event from '../models/Event.js';
import { eventSchema } from '../utils/validation.js';

export const createEvent = async (req, res, next) => {
  try {
    const { error } = eventSchema.validate(req.body);
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
    

    const eventDate = new Date(req.body.date_time);
    const now = new Date();
    
    if (eventDate <= now) {
      return res.status(400).json({
        success: false,
        error: 'Event date must be in the future'
      });
    }
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: { eventId: event.id },
      message: 'Event created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdWithRegistrations(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll();
    
    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const events = await Event.findUpcoming();
    
    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    next(error);
  }
};

export const getEventStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    const stats = await Event.getStats(id);
    
    res.json({
      success: true,
      data: {
        totalRegistrations: parseInt(stats.total_registrations),
        remainingCapacity: parseInt(stats.remaining_capacity),
        percentageUsed: parseFloat(stats.percentage_used)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = eventSchema.validate(req.body);
    
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
    
    const event = await Event.update(id, req.body);
    
    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Event.delete(id);
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};