import pkg from "pg"; // Import the default export from "pg"
import dotenv from "dotenv"; // Load environment variables

dotenv.config(); // Load .env variables

const { Pool } = pkg; // Destructure the Pool class from the package

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  host: process.env.DB_HOST, // Database host
  port: process.env.DB_PORT, // Database port
  database: process.env.DB_NAME, // Database name
  ssl: false, // Force no SSL connection (no matter what the environment variable says)
});

// Log any unexpected errors from the database pool
pool.on("error", (err) => {
  console.error("Unexpected database error:", err.message);
});

// Test the database connection when the app starts
(async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully.");
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1); // Exit if the database connection fails
  }
})();

export default pool;