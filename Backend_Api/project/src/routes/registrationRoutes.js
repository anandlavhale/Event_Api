import express from 'express';
import {
  registerForEvent,
  cancelRegistration,
  getUserRegistrations,
  getEventRegistrations
} from '../controllers/registrationController.js';

const router = express.Router();

router.post('/', registerForEvent);
router.delete('/', cancelRegistration);
router.get('/user/:userId', getUserRegistrations);
router.get('/event/:eventId', getEventRegistrations);

export default router;