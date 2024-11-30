import express from "express";
import dotenv from "dotenv";  // Loading environment variables
import booksRouter from "./routes/books.js";  // Books routes
import path from "path";  // For resolving file paths
import db from "./db.js";  // Database connection

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;  // Use environment variable or default to 3000

// Set up EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files (CSS, JS, images) from the "public" directory
app.use(express.static(path.join(process.cwd(), "public")));  // Ensure public path is correctly resolved

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to build sorting query
const buildSortQuery = (sortBy) => {
  switch (sortBy) {
    case "title":
      return "ORDER BY title ASC";  // Sort alphabetically by title
    case "newest":
      return "ORDER BY date_read DESC";  // Sort by newest (most recent read first)
    case "best":
      return "ORDER BY rating DESC";  // Sort by rating (best rated first)
    default:
      return "";  // Default: no sorting (or fallback to "title")
  }
};

app.get("/", async (req, res) => {
  try {
    // Validate the sort query parameter to ensure it's a known value
    const validSortOptions = ["title", "newest", "best"];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : "title";  // Default to "title"

    // Get the appropriate SQL query based on the sort option
    const sortQuery = buildSortQuery(sortBy);

    // Query the database to fetch the books with sorting applied
    const result = await db.query(`SELECT * FROM books ${sortQuery}`);
    const books = result.rows;

    // Render the homepage with the sorted list of books
    res.render("index", { books, error: null });
  } catch (error) {
    console.error("Error fetching books:", error);

    // Render the homepage with an empty list of books and an error message
    res.render("index", { books: [], error: "Error fetching books. Please try again later." });
  }
});

// Use the books router for all routes starting with "/books"
app.use("/books", booksRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});