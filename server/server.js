const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: process.env['PGUSER'],
  host: process.env['PGHOST'],
  database: process.env['PGDATABASE'],
  password: process.env['PGPASSWORD'],
  port: 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS data (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL
  )
`).catch(err => console.error('Error creating table:', err));

app.use(cors({
  origin: [
    'http://localhost:5173/',
    'http://172.31.128.12:5173/',
    'https://full-stack-copy-attempt-ESWang.replit.app',
    "https://*.replit.dev",
    "https://*.replit.dev:3000",
    "https://*.replit.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use(bodyParser.json());

// Serve static files from client/dist
app.use(express.static('../client/dist'));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Save data to database
app.post('/api/save', async (req, res) => {
  console.log('Anything?');
  if (!req.body || !req.body.content) {
    console.error('Invalid request body');
    return res.status(400).json({ error: 'Content is required' });
  }

  const { content } = req.body;
  try {
    // Test database connection first
    const testResult = await pool.query('SELECT NOW()');
    console.log('Database connection test succeeded:', testResult.rows[0]);

    const insertResult = await pool.query('INSERT INTO data (content) VALUES ($1) RETURNING *', [content]);
    console.log('Insert succeeded:', insertResult.rows[0]);

    res.status(200).json({ message: 'Data saved successfully', data: insertResult.rows[0] });
  } catch (err) {
    console.error('Database error details:', {
      code: err.code,
      message: err.message,
      detail: err.detail,
      schema: err.schema,
      table: err.table
    });
    res.status(500).json({ error: err.message });
  }
});

// Retrieve data from database
app.get('/api/data', async (req, res) => {
  console.log('Requesting data - anything??');
  try {
    const result = await pool.query('SELECT * FROM data');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('=================================');
  console.log('Server running on port 5000');
  console.log('Environment variables:');
  console.log('PGUSER:', process.env.PGUSER);
  console.log('PGHOST:', process.env.PGHOST);
  console.log('PGDATABASE:', process.env.PGDATABASE);
  console.log('=================================');
});