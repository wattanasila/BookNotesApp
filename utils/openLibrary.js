import axios from "axios";

/**
 * Fetches the book cover image URL from Open Library based on ISBN.
 * 
 * @param {string} isbn - The ISBN of the book.
 * @returns {string|null} The URL of the book cover image or `null` if not found.
 */
export const getBookCover = async (isbn) => {
  // Simple ISBN validation (checks if it's a string of digits and has length 13)
  if (!isbn || !/^\d{10}(\d{3})?$/.test(isbn)) {
    console.error("Invalid ISBN provided.");
    return null;
  }

  try {
    // Fetch book data from Open Library API with a configurable timeout
    const { data } = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`, { timeout: process.env.AXIOS_TIMEOUT || 5000 });

    // Check if the cover URL exists and is valid
    if (Array.isArray(data.covers) && data.covers.length > 0) {
      return `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`;
    }

    // No cover found, log and return null
    console.log(`No cover found for ISBN ${isbn}`);
    return null;
  } catch (err) {
    // Log specific error and return null
    if (err.response) {
      console.error(`Error fetching cover for ISBN ${isbn}: ${err.response.status} - ${err.response.statusText}`);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error(`Error: ${err.message}`);
    }
    return null;
  }
};