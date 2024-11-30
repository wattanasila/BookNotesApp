import express from "express";
import db from "../db.js"; // Database connection
import { getBookCover } from "../utils/openLibrary.js"; // Utility to fetch book covers

const router = express.Router();

// To validate if a rating is within the valid range (0-10)
const validateRating = (rating) => rating >= 0 && rating <= 10;

// Fetch and display all books, ordered by rating or date read
router.get("/", async (req, res) => {
  try {
    // Query to fetch all books from the database (ordered by rating, descending)
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC"); // Or change to "date_read ASC" if that's your desired sorting
    
    // Enhance books with default cover URL and "newly added" flag
    const booksWithCover = await Promise.all(result.rows.map((book) => {
       // If cover_url exists, use it; otherwise, fall back to default cover image
      let coverUrl = book.cover_url || "/images/default-cover.jpg";

      // Check if the cover URL is from Open Library and is valid
      if (coverUrl && !coverUrl.includes("covers.openlibrary.org")) {
       coverUrl = "/images/default-cover.jpg"; // Use local fallback image if URL is invalid
      }

      // Flag to indicate whether the book was added in the last 24 hours
      const isNew = (new Date() - new Date(book.created_at)) < 24 * 60 * 60 * 1000; // Last 24 hours

      // Return the book object with additional cover URL and "isNew" flag
      return { ...book, coverUrl, isNew };
    }));

    // Render the index view with the processed books data
    res.render("index", { books: booksWithCover, error: null });

  } catch (err) {
    // Log error and respond with status 500 if there's an issue with fetching books
    console.error("Error fetching books:", err);
    res.status(500).send("Error fetching books.");
  }
});

// Route: Add a new book
router.post("/add", async (req, res) => {
  const { title, author, rating, review, date_read, cover_url } = req.body;

  // Validate rating before proceeding
  if (!validateRating(rating)) {
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
    return res.render("index", { books: result.rows, error: "Rating must be between 0 and 10." });
  }

  try {
    // Insert the new book into the database
    await db.query(
      "INSERT INTO books (title, author, rating, review, date_read, cover_url) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, rating, review, date_read, cover_url || "/images/default-cover.jpg"]
    );    
    res.redirect("/books");
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).send("Error adding book.");
  }
});

// Route: Render the edit form for a specific book
router.get("/edit/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    // Fetch book details by ID
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);

    // Handle case where the book is not found
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    const book = result.rows[0];
    res.render("editBook", { book, error: null });
  } catch (err) {
    console.error("Error retrieving book details:", err);
    res.status(500).send("Error retrieving book details.");
  }
});

router.post("/edit/:id", async (req, res) => {
  const { title, author, rating, review, date_read, cover_url } = req.body;
  const bookId = req.params.id;

  // Validate rating before proceeding
  if (!validateRating(rating)) {
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
    return res.render("index", { books: result.rows, error: 'Rating must be between 0 and 10.' });
  }

  try {
    // Verify that the book exists
    const bookResult = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);

    if (bookResult.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    // Update book details in the database
    await db.query(
      "UPDATE books SET title = $1, author = $2, rating = $3, review = $4, date_read = $5, cover_url = $6 WHERE id = $7",
      [title, author, rating, review, date_read, cover_url || "/images/default-cover.jpg", bookId]
    );
    res.redirect("/books");
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).send("Error updating book.");
  }
});

// Route: Delete a book
router.post("/delete/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    // Verify that the book exists before attempting deletion
    const bookResult = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);

    if (bookResult.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    // Delete the book from the database
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    res.redirect("/books");
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).send("Error deleting book.");
  }
});

export default router;