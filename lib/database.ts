import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: './ratings.db',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_provider_id TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_service_provider_id ON ratings(service_provider_id);
      CREATE INDEX IF NOT EXISTS idx_created_at ON ratings(created_at);
    `);
  }

  return db;
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
  const database = await getDatabase();
  const result = await database.run(
    'INSERT INTO ratings (service_provider_id, rating, ip_address, user_agent) VALUES (?, ?, ?, ?)',
    [rating.service_provider_id, rating.rating, rating.ip_address, rating.user_agent]
  );
  return result.lastID!;
}

export async function getAverageRating(serviceProviderId: string): Promise<{ average: number; count: number }> {
  const database = await getDatabase();
  const result = await database.get(
    'SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE service_provider_id = ?',
    [serviceProviderId]
  );
  return {
    average: result?.average ? Math.round(result.average * 10) / 10 : 0,
    count: result?.count || 0
  };
}

export async function getRatings(serviceProviderId: string, limit: number = 100): Promise<Rating[]> {
  const database = await getDatabase();
  const ratings = await database.all(
    'SELECT * FROM ratings WHERE service_provider_id = ? ORDER BY created_at DESC LIMIT ?',
    [serviceProviderId, limit]
  );
  return ratings;
}