import { Pool, PoolClient } from 'pg';

let pool: Pool | null = null;

export async function getDatabase(): Promise<Pool> {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('DATABASE_URL environment variable is not set');
      throw new Error('DATABASE_URL environment variable is required');
    }

    console.log('Connecting to database...');
    
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    // Test connection and create table if it doesn't exist
    try {
      const client = await pool.connect();
      console.log('Database connection established');
      
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS ratings (
            id SERIAL PRIMARY KEY,
            service_provider_id VARCHAR(255) NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(255),
            user_agent TEXT
          );

          CREATE INDEX IF NOT EXISTS idx_service_provider_id ON ratings(service_provider_id);
          CREATE INDEX IF NOT EXISTS idx_created_at ON ratings(created_at);
        `);
        console.log('Database tables created/verified');
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  return pool;
}

export interface Rating {
  id?: number;
  service_provider_id: string;
  rating: number;
  created_at?: string;
  ip_address?: string;
  user_agent?: string;
}

export async function addRating(rating: Omit<Rating, 'id' | 'created_at'>): Promise<number> {
  const pool = await getDatabase();
  const result = await pool.query(
    'INSERT INTO ratings (service_provider_id, rating, ip_address, user_agent) VALUES ($1, $2, $3, $4) RETURNING id',
    [rating.service_provider_id, rating.rating, rating.ip_address, rating.user_agent]
  );
  return result.rows[0].id;
}

export async function getAverageRating(serviceProviderId: string): Promise<{ average: number; count: number }> {
  try {
    const pool = await getDatabase();
    const result = await pool.query(
      'SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE service_provider_id = $1',
      [serviceProviderId]
    );
    const row = result.rows[0];
    return {
      average: row?.average ? Math.round(parseFloat(row.average) * 10) / 10 : 0,
      count: parseInt(row?.count) || 0
    };
  } catch (error) {
    console.error('Error getting average rating:', error);
    throw error;
  }
}

export async function getRatings(serviceProviderId: string, limit: number = 100): Promise<Rating[]> {
  const pool = await getDatabase();
  const result = await pool.query(
    'SELECT * FROM ratings WHERE service_provider_id = $1 ORDER BY created_at DESC LIMIT $2',
    [serviceProviderId, limit]
  );
  return result.rows;
}