require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const linkRoutes = require('./routes/links.routes');
const { redirectLink } = require('./controllers/links.controller');

app.use('/auth', authRoutes);
app.use('/links', linkRoutes);
app.get('/:short_code', redirectLink);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));