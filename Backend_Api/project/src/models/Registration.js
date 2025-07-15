import pool from '../config/database.js';
import logger from '../config/logger.js';

class Registration {
  static async create(userId, eventId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if event exists and is in the future
      const eventResult = await client.query(
        'SELECT * FROM events WHERE id = $1',
        [eventId]
      );
      
      if (eventResult.rows.length === 0) {
        throw new Error('Event not found');
      }
      
      const event = eventResult.rows[0];
      const eventDate = new Date(event.date_time);
      const now = new Date();
      
      if (eventDate <= now) {
        throw new Error('Cannot register for past events');
      }
      
      // Check if user exists
      const userResult = await client.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      // Check if user is already registered
      const existingRegistration = await client.query(
        'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
        [userId, eventId]
      );
      
      if (existingRegistration.rows.length > 0) {
        throw new Error('User is already registered for this event');
      }
      
      // Check if event is full
      const registrationCount = await client.query(
        'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
        [eventId]
      );
      
      if (parseInt(registrationCount.rows[0].count) >= event.capacity) {
        throw new Error('Event is full');
      }
      
      // Create registration
      const result = await client.query(
        'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *',
        [userId, eventId]
      );
      
      await client.query('COMMIT');
      
      logger.info(`User ${userId} registered for event ${eventId}`);
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async cancel(userId, eventId) {
    const result = await pool.query(
      'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *',
      [userId, eventId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Registration not found');
    }
    
    logger.info(`User ${userId} cancelled registration for event ${eventId}`);
    return result.rows[0];
  }
  
  static async findByUserAndEvent(userId, eventId) {
    const result = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    
    return result.rows[0];
  }
  
  static async findByUser(userId) {
    const result = await pool.query(`
      SELECT 
        r.*,
        e.title,
        e.date_time,
        e.location
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
      ORDER BY e.date_time ASC
    `, [userId]);
    
    return result.rows;
  }
  
  static async findByEvent(eventId) {
    const result = await pool.query(`
      SELECT 
        r.*,
        u.name,
        u.email
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = $1
      ORDER BY r.registered_at ASC
    `, [eventId]);
    
    return result.rows;
  }
}

export default Registration;