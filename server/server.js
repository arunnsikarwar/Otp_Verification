const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv"); // Changed from `require("dotenv").config();`
const cookieParser = require("cookie-parser");
const connectDB = require('./db/db');
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

dotenv.config(); // Initialize dotenv for environment variables

const app = express();

// Configure CORS middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// Initialize database connection
connectDB();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing URL-encoded request bodies with extended options
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Define your API routes
app.use("/api/auth", userRoutes);

const port = process.env.PORT || 5000; // Use a default port (5000) if PORT is not defined in environment variables

app.listen(port, () => {
    console.log(`Server is Running on PORT ${port}`);
});
