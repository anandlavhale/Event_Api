import pool from '../config/database.js';
import logger from '../config/logger.js';

class User {
  static async create(userData) {
    const { name, email } = userData;
    
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      
      logger.info(`User created: ${email}`);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }
  
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }
  
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    
    return result.rows;
  }
  
  static async update(id, userData) {
    const { name, email } = userData;
    
    try {
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
        [name, email, id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      logger.info(`User updated: ${id}`);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    logger.info(`User deleted: ${id}`);
    return result.rows[0];
  }
}

export default User;