require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const router = require("./route/index");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const app = express();

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'https://sqa-task-fe-production.up.railway.app',
      'http://localhost:3000',
      'http://localhost:5173',
    ];
    // Allow any Vercel preview URL for this project
    if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/api", router);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});