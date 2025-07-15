import express from 'express';
import {
  createEvent,
  getEvent,
  getAllEvents,
  getUpcomingEvents,
  getEventStats,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEvent);
router.get('/:id/stats', getEventStats);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;