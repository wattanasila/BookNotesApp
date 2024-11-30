# Book Notes App 📚
Transform the Way You Remember Books
Do you love reading but struggle to recall the most important details from your books? The Book Notes App is here to revolutionize how you track, review, and sort your reading experiences. Inspired by Derek Sivers’ innovative book tracking system, this app is your ultimate tool to record insights, ratings, and reviews for every book you read.

# Why This Project?
This project was built as part of a capstone challenge to apply cutting-edge web development techniques, create a seamless user experience, and solve a common problem for book enthusiasts. It combines powerful backend functionality with a clean and intuitive frontend design, making it the perfect platform to organize your literary journey.

# Key Features
📚 Comprehensive Book Management
Add Books: Input titles, authors, ratings, reviews, and even a reading date.
Edit and Update: Modify your book entries with ease.
Delete Books: Declutter your library by removing unwanted entries.

🌟 Dynamic Sorting and Filtering
Sort Books: Quickly organize by title, rating, or recency.
Visual Presentation: Each book includes its cover image (fetched automatically using the Open Library Covers API) or a default placeholder.

💾 Robust Data Persistence
Powered by PostgreSQL, your data is stored securely and remains accessible across sessions.
Fully implemented CRUD operations: Create, Read, Update, and Delete functionality ensures seamless data management.

🎨 Modern User Interface
Designed with EJS templating, HTML, CSS, and a touch of JavaScript for interactivity.
Mobile-friendly, responsive, and easy to navigate for all users.

🚀 Intelligent Features
Newly Added Highlight: Recently added books are flagged for quick recognition.
Default Cover Image: Books without a valid cover URL still look great with a fallback image.

# Technical Details
Project Structure
bash
Copy code
BookNotesApp/
├── public/
│   └── styles.css        # Styling for the application
├── routes/
│   └── books.js          # Express routes for CRUD operations
├── utils/
│   └── openLibrary.js    # Utility for Open Library Covers API integration
├── views/
│   ├── addBook.ejs       # EJS template for adding a book
│   ├── editBook.ejs      # EJS template for editing a book
│   └── index.ejs         # Main EJS template for viewing books
├── .env                  # Environment variables for database connection
├── .gitignore            # Git ignore file
├── app.js                # Main server file
├── db.js                 # PostgreSQL connection setup
├── package.json          # Node.js project configuration
└── README.md             # Project documentation

# Database Schema
The PostgreSQL database ensures data integrity and reliability. Here’s the table structure:

sql
Copy code
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  rating DECIMAL(3, 1) CHECK (rating >= 0 AND rating <= 10),
  review TEXT,
  date_read DATE,
  cover_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Getting Started
Prerequisites
To set up and run this project, you’ll need:

Node.js: Download Node.js
PostgreSQL: Install PostgreSQL

# Installation
Clone the Repository

bash
Copy code
git clone <repository-url>  
cd BookNotesApp  
Install Dependencies

bash
Copy code
npm install  
Set Up Environment Variables
Create a .env file in the root directory and add your PostgreSQL connection details:

env
Copy code
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/book_notes  
Run Database Migration
Use the provided schema to create your database table.

Start the Server
Run the application using:

bash
Copy code
node app.js  
Or, for live-reloading during development:

bash
Copy code
nodemon app.js  
Open the App
Visit your app at:

arduino
Copy code
http://localhost:3000

# Capstone Highlights
Real-World Application
This project incorporates essential web development skills, including:

Database design and integration.
Server-side programming with Express.js and Node.js.
API integration for dynamic content (Open Library Covers API).
Frontend development for an intuitive user experience.
Seamless User Experience
Thoughtful design ensures both power users and casual readers can manage their book data effortlessly.

# About the Developer
Developed with passion and precision by Wattana Silangam. I am committed to crafting web solutions that solve real-world problems while providing an outstanding user experience.
