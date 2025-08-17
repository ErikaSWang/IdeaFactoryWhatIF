const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const OpenAI = require('openai');
//const { Agent, run, tool } = require('@openai/agents');

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
    'https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev:5173'
  ],
  credentials: true
}));

app.use(bodyParser.json());

// Serve static files from client/dist
app.use(express.static('../client/dist'));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Input endpoint
app.post('/api/analyze-conflict', async (req, res) => {
  console.log('Request received');
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  try {
    const systemPrompt = `The user is ALWAYS an individual, not a politician. So always keep that in mind and try to find ways to empower, uplift, and encourage them with ideas they for ways they may be able to take action, whenever possible.
    Can you:
    1. Look at the user input, and figure out what other parties may be involved, even if they just mention one party and a personally desired outcome? If it's a global conflict they only mention one party, you must identify the other party(s) by name (It's imperative you use the web search to find the right individuals and/or organizations involved, as well as the most up-to-date details of the conflict, and that you understand the dynamics at play. Otherwise your response will target the wrong issues.)
    2. Collect the all the relevant facts of that conflict that have led up to this point (historical background (as far back as possible - but as short as possible. As well, current issues preventing peace)
    3. What are the feelings and mindset of the parties involved in the conflict?
    4. What are the most realistic trajectories for this dispute? Please give a rating for which seems most realistic if nothing changes. It's imperative you be specific to this particular situation, relying on the web search you did above to customize your assessment to THESE people in THIS situation, based on the work you did in #1. DO NOT generalize and use patterns from similar situations you have in your data set.
    5. Which individuals or groups of individuals have the power to change the trajectory to something better? Are there any new options that haven't been tried before, that could realistically be achieved? Please mention each by name, and then be as specific and as thorough as possible with what they could do differently, to effect a better outcome. This is one of the most important parts.
    6. Are there any past traumas, current hopes/dreams/fears/frustrations that would need to be healed/addressed to make #5 realistically viable? Are there any actions or shifts in mindset that might need to be made?
    7. Acknowledge any parties who may be motivated to take things in a different direction from #4.
    8. Give me a % guestimate of the possibility of there being a realistic course of action that might potentially lead to peace and greater productivity/prosperity.
    9. Are there any existing software tools that could be used to help with this conflict?
    10. Are there any new software tools or other pieces of technology that could be created to help? Please think of as many as you possibly can, from the most obvious, to anything outside the box that could possibly make a difference. For any new software tool ideas you came up with, please add whether you would you be able to build a prototype right now.

Please use simple language.

Please use the following JSON format for your response. Return only a single valid JSON object. No prose, no code fences, no comments, no trailing commas. For any percentages, return numbers between 0 and 1 (e.g., 0.72), not strings like 72%.

{
  "title": ""
  "conflict_identified": "",
  "parties identified": "",
  "facts": {
    "historical_background": "",
    "current_issues_preventing_peace": "",
  },
  "realistic_trajectories": [],
  "new_options": [],
  "healing_needed": "",
  "antagonists": "",
  "odds": "",
  "tools": {
    "existing": "",
    "new": []
  }
}`;
    
    const client = OpenAI()
    
    const completion = await client.responses.create({
      model: "gpt-5-nano",
      reasoning: {
        effort: "medium"
      },
      text: {
        verbosity: "low"
      },
      /*
      tools: [{
          type: "web_search_preview",
          search_context_size: "low",
      }],
      */
      instructions: systemPrompt,
      input: userInput
    });

    const aiResponse = completion.output_text;
    console.log('AI response:', aiResponse)
    let analysis = {};

    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.log('Failed to parse JSON, using text response');
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
