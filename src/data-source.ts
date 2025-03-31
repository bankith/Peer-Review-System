// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import '@/envConfig.ts'

export const AppDataSource = new DataSource({
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": "PeerReviewSystem",
    "synchronize": true,
    "logging": false,
    "entities": [
      User,
      "entities/**/*.ts"
    ]
  }
);

export async function initializeDataSource() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize().catch(err => console.error("Error during Data Source initialization", err));
    }
}
