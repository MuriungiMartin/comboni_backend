const express = require('express');
const cors = require('cors');
const db = require('./db');
const usersRouter = require('./routes/users');
const communicationsRouter = require('./routes/communications');
const eventsRouter = require('./routes/events');
const blogsRouter = require('./routes/blogs');
const inquiriesRouter = require('./routes/inquiries');
const faqsRouter = require('./routes/faqs');

// ... other routers

const app = express();

app.use(express.json());
app.use(cors()); // Configure CORS settings for React frontend

// Authentication middleware (optional)

app.use('/users', usersRouter);
app.use('/communications', communicationsRouter);
app.use('/events', eventsRouter);
app.use('/blogs', blogsRouter);
app.use('/inquiries', inquiriesRouter);
app.use('/faqs', faqsRouter);
// ... other routers

const port = process.env.PORT || 3000; // Use environment variable for port

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
