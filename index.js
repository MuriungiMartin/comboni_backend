const express = require('express');
const cors = require('cors');
const db = require('./db');
const usersRouter = require('./routes/users');
// ... other routers

const app = express();

app.use(express.json());
app.use(cors()); // Configure CORS settings for React frontend

// Authentication middleware (optional)

app.use('/users', usersRouter);
// ... other routers

const port = process.env.PORT || 3000; // Use environment variable for port

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
