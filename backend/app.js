require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_IP,
  credentials: true
}))

// Routes
const authRoutes = require('./routes/auth.routes');
const linkRoutes = require('./routes/links.routes');
const { redirectLink } = require('./controllers/links.controller');

app.use('/auth', authRoutes);
app.use('/links', linkRoutes);
app.get('/:short_code', redirectLink);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));