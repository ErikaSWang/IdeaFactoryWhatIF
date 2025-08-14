
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
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
            placeholder="What global conflict is weighing you down?

Examples:
• Israel-Palestine conflict
• Russia-Ukraine war
• China-Taiwan tensions
• Kashmir dispute
• Syrian civil war
• Yemen conflict

Share your thoughts, concerns, or questions about any international crisis that's on your mind..."
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
              {loading ? '🤔 Analyzing with compassion...' : '🕊️ Is Peace Possible?'}
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

            {analysis.sentimentAnalysis && (
              <div className="analysis-section">
                <h3>📊 Emotional Sentiment Analysis</h3>
                <div className="sentiment-grid">
                  {Object.entries(analysis.sentimentAnalysis).map(([emotion, value]) => (
                    <div key={emotion} className="sentiment-item">
                      <div className="sentiment-label">
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </div>
                      <div className="sentiment-bar">
                        <div 
                          className="sentiment-fill" 
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                      <div className="sentiment-value">{(value * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.perspectiveAnalysis && (
              <div className="analysis-section">
                <h3>🔍 Perspective Analysis</h3>
                <div className="perspective-grid">
                  {Object.entries(analysis.perspectiveAnalysis).map(([aspect, value]) => (
                    <div key={aspect} className="perspective-item">
                      <div className="perspective-label">
                        {aspect.replace(/_/g, ' ').charAt(0).toUpperCase() + aspect.replace(/_/g, ' ').slice(1)}
                      </div>
                      <div className="perspective-bar">
                        <div 
                          className="perspective-fill" 
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                      <div className="perspective-value">{(value * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.facts && (
              <div className="analysis-section">
                <h3>📚 Historical Context & Current Issues</h3>
                {analysis.facts.historical_background && analysis.facts.historical_background.length > 0 && (
                  <div className="facts-subsection">
                    <h4>🏛️ Historical Background</h4>
                    <ul>
                      {analysis.facts.historical_background.map((fact, index) => (
                        <li key={index}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.facts.current_issues_preventing_peace && analysis.facts.current_issues_preventing_peace.length > 0 && (
                  <div className="facts-subsection">
                    <h4>⚠️ Current Issues Preventing Peace</h4>
                    <ul>
                      {analysis.facts.current_issues_preventing_peace.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {analysis.possibility_of_peace && analysis.possibility_of_peace.length > 0 && (
              <div className="analysis-section hope">
                <h3>🕊️ Possibility of Peace</h3>
                <ul>
                  {analysis.possibility_of_peace.map((assessment, index) => (
                    <li key={index}>{assessment}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.optimal_path_forward && analysis.optimal_path_forward.length > 0 && (
              <div className="analysis-section">
                <h3>🛤️ Optimal Path Forward</h3>
                <ul>
                  {analysis.optimal_path_forward.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.difficult_not_impossible && analysis.difficult_not_impossible.length > 0 && (
              <div className="analysis-section">
                <h3>💪 Challenges But Not Impossible</h3>
                <ul>
                  {analysis.difficult_not_impossible.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
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
