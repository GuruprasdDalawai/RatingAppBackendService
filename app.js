// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const mainRoutes = require('./routes/mainRoutes');

const PORT = process.env.PORT || 3000;

// Allow all domains

app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Use employee routes
app.use('/api', mainRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
