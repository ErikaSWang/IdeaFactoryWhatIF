const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const OpenAI = require('openai');
//const { Agent, run, tool } = require('@openai/agents');

const app = express();
const PORT = process.env.PORT || 5000

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


// Create table if not exist
pool.query(`
  CREATE TABLE IF NOT EXISTS public (
    id SERIAL PRIMARY KEY,
    user_input TEXT NOT NULL,
    tools JSONB,
    conversation JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating public table:', err));


app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:5173',
    'http://172.31.84.98',
    'http://172.31.84.98:5173',
    'https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev',
    'https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev:5173',
    'https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev:3000',
    'https://IdeaFactoryWhatIF.replit.app',
    'https://IdeaFactoryWhatIF.replit.app:5173',
    'https://IdeaFactoryWhatIF.replit.app:3000',
    /.*\.replit\.dev$/,
    /.*\.replit\.app$/
  ],
  credentials: true
}));

app.use(bodyParser.json());

// Serve static files from client/dist (must be after API routes)
app.use(express.static(path.join(__dirname, '../client/dist')));

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});


app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Health check endpoint for deployment platform
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

let history = [];
let id;

// Input endpoint #1
app.post('/api/analyze-conflict', async (req, res) => {
  console.log('Request received');
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  // Add the user input to the history
  history.push({
    role: "user",
    content: userInput
  });

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

<format of response>
And return a single valid JSON object - it MUST be a single valid JSON object ... no prose, no code fences, no comments, no trailing commas. 

Where there are "" please return a string, and where there are [] please return an array.

- For the realistic trajectories, please use key:value pairs for the name, description, and likelihood
- For the new options, please use key:value pairs for the name, description, and likelihood
- For the existing tools, please use key:value pairs for the tool, and the url to the tool
- For the new tools, please use key:value pairs for the tool, and whether it is buildable (right now - lower case yes/no)

For any percentages, return numbers between 0 and 1 (e.g., 0.72), not strings like 72%.

{
  "show_kindness_understanding_compassion": "",
  "title": ""
  "conflict_identified": "",
  "parties identified": [],
  "facts": {
    "historical_background": [],
    "current_issues_preventing_peace": [],
  },
  "realistic_trajectories": [
    {
      "name": "",
      "description": "",
      "likelihood": 0.0
    }
  ],
  "new_options": [
    {
      "name": "",
      "description": "",
      "likelihood": 0.0
    }
  ],
  "healing_needed": "",
  "antagonists": "",
  "tools": {
    "existing": [
      "tool": "",
      "url": ""
    ],
    "new": [
      "tool": "",
      "buildable": ""
    ]
  }
}
</format of response>
`;

    const client = new OpenAI()

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
      store: true,
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

    // Add the response to the history
    history.push({
      role: "assistant",
      content: aiResponse
    });

    // Save the response id
    id = completion.id;
    console.log('Response id:', id)


    res.json({
      analysis: analysis
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: 'Failed to analyze conflict',
      details: error.message
    });
  }
});

// Input endpoint #1
app.post('/api/follow-up', async (req, res) => {
  console.log('Request received');
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  history.push({
    role: "user",
    content: userInput
  });


  try {
    const systemPrompt = `

Please use simple language.

<format of response>
And return a single valid JSON object - it MUST be a single valid JSON object ... no prose, no code fences, no comments, no trailing commas. 

Where there are "" please return a string, and where there are [] please return an array.

{
  "more_kindness_understanding_compassion": "",
  "response": ""
}
</format of response>
`;

    const client = new OpenAI()

    const completion = await client.responses.create({
      model: "gpt-5-nano",
      reasoning: {
        effort: "low"
      },
      text: {
        verbosity: "low"
      },
      previous_response_id: id,
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

    // Add the response to the history
    history.push({
      role: "assistant",
      content: aiResponse
    });


    res.json({
      analysis: analysis
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: 'Failed to analyze conflict',
      details: error.message
    });
  }
});


// Save share to database
app.post('/api/share', async (req, res) => {
  console.log('Share request received');
  console.log('history:', history)
  
  if (!history || history.length < 2) {
    return res.status(400).json({ error: 'No conversation history available' });
  }

  const userInput = history[0].content;
  const conversation = history;
  let tools = {};

  try {
    // Parse the AI response to get just the tools
    const toolsData = JSON.parse(history[1].content);
    tools = toolsData.tools || {};
  } catch (parseError) {
    console.log('Failed to parse tools data for sharing');
    tools = {};
  }

  try {
    const result = await pool.query(
      'INSERT INTO public (user_input, tools, conversation) VALUES ($1, $2, $3) RETURNING *',
      [userInput, tools, conversation]
    );
    res.json({ message: 'Share saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conflicts
app.get('/api/public', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public ORDER BY created_at DESC');

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Catch-all: serve React app for any non-API routes (MUST be last)
app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});