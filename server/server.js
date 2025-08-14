
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const OpenAI = require('openai');

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

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});

// Create tables if not exist
pool.query(`
  CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_input TEXT NOT NULL,
    analysis JSONB,
    ai_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating conversations table:', err));

pool.query(`
  CREATE TABLE IF NOT EXISTS conflicts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    parties JSONB,
    key_issues JSONB,
    analysis JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating conflicts table:', err));

app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:5173',
    'http://172.31.107.66',
    'http://172.31.107.66:5173',
    'https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev',
    'https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev:3000'
  ],
  credentials: true
}));

app.use(bodyParser.json());

// Serve static files from client/dist
app.use(express.static('../client/dist'));

app.get('/', (req, res) => {
  res.send('Conflict Resolution AI Server is running!');
});

// Conflict resolution analysis endpoint
app.post('/api/analyze-conflict', async (req, res) => {
  console.log('Conflict analysis request received');
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  try {
    const systemPrompt = `You are a compassionate, neutral third-party conflict resolution AI assistant. Your primary goal is to seek thorough, universally accurate truth and promote global peace and productive use of resources.

Your analysis should:
1. Assess the user's perspective on tone, completeness, accuracy, and potential bias
2. Identify all relevant parties to the conflict
3. Gather important key data about the situation
4. Understand each side's feelings, motivations, and underlying causes
5. Assess if improvement is possible
6. Show empathy while acknowledging human suffering
7. Suggest realistic changes needed by parties
8. Evaluate likelihood of positive outcomes
9. Identify other parties with obligations to act
10. Suggest ways to help parties feel heard and heal

Always be compassionate, non-judgmental, and accepting of where people are, while seeking objective truth and peaceful solutions.

CRITICAL: You must respond with valid JSON only. Do not include any text before or after the JSON. All arrays must be arrays of strings, never objects.

Response format:
{
  "sentimentAnalysis": {
    "anger": 0.0,
    "fear": 0.0,
    "sadness": 0.0,
    "hope": 0.0,
    "frustration": 0.0,
    "compassion": 0.0
  },
  "toneAssessment": "analysis of user's tone",
  "biasAnalysis": "assessment of completeness and potential bias",
  "relevantParties": ["party1", "party2", "party3"],
  "keyIssues": ["issue1", "issue2", "issue3"],
  "motivations": "understanding of each side's feelings and motivations",
  "improvementPossible": "assessment of whether better outcomes are possible",
  "recommendedChanges": "realistic suggestions for each party",
  "likelihood": "probability assessment of positive change",
  "externalParties": "other parties who should act or refrain from acting",
  "healingApproach": "suggestions to help parties feel heard and heal",
  "compassionateResponse": "your main empathetic response to the user"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('AI response:', aiResponse)
    let analysis = {};

    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.log('Failed to parse JSON, using text response');
      analysis = { compassionateResponse: aiResponse };
    }

    // Save conversation to database
    const insertResult = await pool.query(
      'INSERT INTO conversations (user_input, analysis, ai_response) VALUES ($1, $2, $3) RETURNING *',
      [userInput, analysis, aiResponse]
    );

    res.json({
      analysis: analysis,
      conversationId: insertResult.rows[0].id,
      timestamp: insertResult.rows[0].created_at
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze conflict',
      details: error.message 
    });
  }
});

// Get conversation history
app.get('/api/conversations', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM conversations ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save conflict analysis as a structured conflict entry
app.post('/api/save-conflict', async (req, res) => {
  const { name, parties, keyIssues, analysis, recommendations } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO conflicts (name, parties, key_issues, analysis, recommendations) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, parties, keyIssues, analysis, recommendations]
    );
    res.json({ message: 'Conflict saved successfully', conflict: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conflicts
app.get('/api/conflicts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conflicts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('=================================');
  console.log('Conflict Resolution AI Server running on port 5000');
  console.log('Environment variables:');
  console.log('PGUSER:', process.env.PGUSER);
  console.log('PGHOST:', process.env.PGHOST);
  console.log('PGDATABASE:', process.env.PGDATABASE);
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
  console.log('=================================');
});
