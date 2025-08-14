
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyzeConflict = async () => {
    if (!userInput.trim()) {
      setError('Please enter information about a conflict to analyze.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/analyze-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result.analysis);
      setUserInput('');
      
    } catch (error) {
      console.error('Error analyzing conflict:', error);
      setError(`Error: ${error.message}. Please check that your OpenAI API key is set correctly.`);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/conversations');
      const result = await response.json();
      setConversations(result);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  useEffect(() => {
    if (showHistory) {
      loadConversations();
    }
  }, [showHistory]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalyzeConflict();
    }
  };

  return (
    <div className="conflict-resolution-app">
      <header className="app-header">
        <h1>🕊️ Peaceful Path AI</h1>
        <p className="app-subtitle">
          An AI assistant dedicated to finding peaceful solutions to global conflicts
        </p>
        <p className="app-description">
          Share your thoughts about any ongoing conflict, and I'll help analyze the situation 
          with compassion, seeking truth and pathways toward peace and prosperity for all.
        </p>
      </header>

      <main className="main-content">
        <div className="input-section">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about a conflict you're concerned about... What's happening? Who's involved? What are your thoughts and feelings about it?

Examples:
• A personal conflict you're experiencing
• A community dispute you've observed  
• An international crisis you're worried about
• Historical conflicts you want to understand better

I'm here to listen without judgment and help explore paths toward understanding and peace."
            className="conflict-input"
            disabled={loading}
            rows={8}
          />
          <div className="input-actions">
            <button 
              onClick={handleAnalyzeConflict} 
              disabled={loading || !userInput.trim()}
              className="analyze-button"
            >
              {loading ? '🤔 Analyzing with compassion...' : '🔍 Seek Understanding'}
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="history-button"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
          <p className="input-hint">💡 Press Ctrl+Enter to analyze</p>
        </div>

        {error && (
          <div className="error-message">
            <h3>⚠️ Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {analysis && (
          <div className="analysis-results">
            <h2>🤝 Compassionate Analysis</h2>
            
            {analysis.compassionateResponse && (
              <div className="analysis-section main-response">
                <h3>💙 Understanding Your Perspective</h3>
                <p>{analysis.compassionateResponse}</p>
              </div>
            )}

            {analysis.toneAssessment && (
              <div className="analysis-section">
                <h3>🎭 Emotional Tone Assessment</h3>
                <p>{analysis.toneAssessment}</p>
              </div>
            )}

            {analysis.biasAnalysis && (
              <div className="analysis-section">
                <h3>🔍 Perspective Analysis</h3>
                <p>{analysis.biasAnalysis}</p>
              </div>
            )}

            {analysis.relevantParties && analysis.relevantParties.length > 0 && (
              <div className="analysis-section">
                <h3>👥 Key Parties Involved</h3>
                <ul>
                  {analysis.relevantParties.map((party, index) => (
                    <li key={index}>{party}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.keyIssues && analysis.keyIssues.length > 0 && (
              <div className="analysis-section">
                <h3>⚖️ Core Issues</h3>
                <ul>
                  {analysis.keyIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.motivations && (
              <div className="analysis-section">
                <h3>❤️ Understanding Each Side</h3>
                <p>{analysis.motivations}</p>
              </div>
            )}

            {analysis.improvementPossible && (
              <div className="analysis-section hope">
                <h3>🌅 Is Better Possible?</h3>
                <p>{analysis.improvementPossible}</p>
              </div>
            )}

            {analysis.recommendedChanges && (
              <div className="analysis-section">
                <h3>🛤️ Pathways Forward</h3>
                <p>{analysis.recommendedChanges}</p>
              </div>
            )}

            {analysis.likelihood && (
              <div className="analysis-section">
                <h3>📊 Realistic Assessment</h3>
                <p>{analysis.likelihood}</p>
              </div>
            )}

            {analysis.externalParties && (
              <div className="analysis-section">
                <h3>🌍 Others Who Can Help</h3>
                <p>{analysis.externalParties}</p>
              </div>
            )}

            {analysis.healingApproach && (
              <div className="analysis-section healing">
                <h3>🌱 Healing and Understanding</h3>
                <p>{analysis.healingApproach}</p>
              </div>
            )}
          </div>
        )}

        {showHistory && (
          <div className="conversation-history">
            <h2>📚 Previous Conversations</h2>
            {conversations.length === 0 ? (
              <p>No conversations yet. Start by sharing a conflict you'd like to explore.</p>
            ) : (
              conversations.map((conv) => (
                <div key={conv.id} className="conversation-item">
                  <div className="conversation-date">
                    {new Date(conv.created_at).toLocaleString()}
                  </div>
                  <div className="conversation-input">
                    <strong>Your input:</strong> {conv.user_input.substring(0, 200)}...
                  </div>
                  {conv.analysis?.compassionateResponse && (
                    <div className="conversation-response">
                      <strong>AI Response:</strong> {conv.analysis.compassionateResponse.substring(0, 300)}...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          🌍 Built with compassion to help explore pathways toward peace and understanding. 
          This tool seeks objective truth while honoring all human experiences.
        </p>
      </footer>
    </div>
  );
}

export default App;
