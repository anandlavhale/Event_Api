import pool from '../config/database.js';
import logger from '../config/logger.js';

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('DELETE FROM registrations');
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM users');
    
    // Reset sequences
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE events_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE registrations_id_seq RESTART WITH 1');
    
    // Insert sample users
    const users = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' },
      { name: 'Alice Brown', email: 'alice@example.com' },
      { name: 'Charlie Wilson', email: 'charlie@example.com' }
    ];
    
    for (const user of users) {
      await client.query(
        'INSERT INTO users (name, email) VALUES ($1, $2)',
        [user.name, user.email]
      );
    }
    
    // Insert sample events
    const events = [
      {
        title: 'Tech Conference 2024',
        date_time: '2024-12-15T10:00:00.000Z',
        location: 'San Francisco, CA',
        capacity: 500
      },
      {
        title: 'Music Festival',
        date_time: '2024-12-20T15:00:00.000Z',
        location: 'Austin, TX',
        capacity: 1000
      },
      {
        title: 'Art Exhibition',
        date_time: '2024-12-25T11:00:00.000Z',
        location: 'New York, NY',
        capacity: 200
      },
      {
        title: 'Food & Wine Tasting',
        date_time: '2024-12-30T18:00:00.000Z',
        location: 'Los Angeles, CA',
        capacity: 150
      }
    ];
    
    for (const event of events) {
      await client.query(
        'INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4)',
        [event.title, event.date_time, event.location, event.capacity]
      );
    }
    
    // Insert sample registrations
    const registrations = [
      { user_id: 1, event_id: 1 },
      { user_id: 2, event_id: 1 },
      { user_id: 3, event_id: 2 },
      { user_id: 1, event_id: 3 },
      { user_id: 4, event_id: 3 },
      { user_id: 5, event_id: 4 }
    ];
    
    for (const registration of registrations) {
      await client.query(
        'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)',
        [registration.user_id, registration.event_id]
      );
    }
    
    await client.query('COMMIT');
    logger.info('✅ Database seeded successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run seed
seedData()
  .then(() => {
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });