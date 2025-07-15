import pool from '../config/database.js';
import logger from '../config/logger.js';

class Event {
  static async create(eventData) {
    const { title, date_time, location, capacity } = eventData;
    
    const result = await pool.query(
      'INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, date_time, location, capacity]
    );
    
    logger.info(`Event created: ${title}`);
    return result.rows[0];
  }
  
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async findByIdWithRegistrations(id) {
    const result = await pool.query(`
      SELECT 
        e.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'registered_at', r.registered_at
            )
          ) FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) as registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE e.id = $1
      GROUP BY e.id
    `, [id]);
    
    return result.rows[0];
  }
  
  static async findUpcoming() {
    const result = await pool.query(`
      SELECT 
        e.*,
        COUNT(r.id) as registration_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.date_time > NOW()
      GROUP BY e.id
      ORDER BY e.date_time ASC, e.location ASC
    `);
    
    return result.rows;
  }
  
  static async findAll() {
    const result = await pool.query(`
      SELECT 
        e.*,
        COUNT(r.id) as registration_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY e.date_time DESC
    `);
    
    return result.rows;
  }
  
  static async getStats(id) {
    const result = await pool.query(`
      SELECT 
        e.capacity,
        COUNT(r.id) as total_registrations,
        (e.capacity - COUNT(r.id)) as remaining_capacity,
        CASE 
          WHEN e.capacity > 0 THEN 
            ROUND((COUNT(r.id)::DECIMAL / e.capacity) * 100, 2)
          ELSE 0 
        END as percentage_used
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id, e.capacity
    `, [id]);
    
    return result.rows[0];
  }
  
  static async update(id, eventData) {
    const { title, date_time, location, capacity } = eventData;
    
    const result = await pool.query(
      'UPDATE events SET title = $1, date_time = $2, location = $3, capacity = $4 WHERE id = $5 RETURNING *',
      [title, date_time, location, capacity, id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Event not found');
    }
    
    logger.info(`Event updated: ${id}`);
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Event not found');
    }
    
    logger.info(`Event deleted: ${id}`);
    return result.rows[0];
  }
}

export default Event;