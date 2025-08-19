import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

class Database {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "",
      user: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on("connect", () => {
      console.log("Connected to PostgreSQL database");
    });

    this.pool.on("error", (err) => {
      console.error("PostgreSQL connection error:", err);
    });
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log("Executed query", { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async close() {
    await this.pool.end();
  }

  // Initialize database tables
  async initTables() {
    const createCredentialsTable = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS credentials (
        credentials_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
        password VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id UUID NOT NULL UNIQUE,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_credentials_email ON credentials(email);
      CREATE INDEX IF NOT EXISTS idx_credentials_created_at ON credentials(created_at);
      CREATE INDEX IF NOT EXISTS idx_credentials_updated_at ON credentials(updated_at);
\
    `;

    try {
      await this.query(createCredentialsTable);
      await this.query(createIndexes);
      console.log("Database tables initialized successfully");
    } catch (error) {
      console.error("Error initializing database tables:", error);
      throw error;
    }
  }
}

export default new Database();
