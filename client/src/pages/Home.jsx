import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import { Query } from "../components/Query";
import { Spinner } from "../components/Loading";
import { Fresh } from "../components/Fresh";

export const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [fresh, setFresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [returned, setReturned] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);

  const handleAnalyzeConflict = async () => {
    if (!userInput.trim()) {
      setError('Please enter information about a conflict to analyze.');
      return;
    }
    setTimeout(() => {
      setLoading(true);
    }, 500);
    
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
      setConversation(prevConversation => [
        ...prevConversation, {user: userInput, response: result.analysis}
      ])
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
    <>
      <Container className='d-flex flex-col justify-content-center align-content-between flex-wrap main-component'>


        <Container className='d-flex flex-col justify-content-center output'>
          { loading ?
            <Spinner />
            :
            <Fresh />
          }
          {analysis && (
            <div className="analysis-results">
              {analysis.sentimentAnalysis && (
                <div className="analysis-section">
                  <h3>Sentiment Analysis</h3>
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
                  <h3>Perspective Analysis</h3>
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
                  <h3>Summary of the Situation</h3>
                  {analysis.facts.historical_background && analysis.facts.historical_background.length > 0 && (
                    <div className="facts-subsection">
                      <h4>Historical Background</h4>
                      <p>{analysis.facts.historical_background}</p>
                    </div>
                  )}
                  {analysis.facts.current_issues_preventing_peace && analysis.facts.current_issues_preventing_peace.length > 0 && (
                    <div className="facts-subsection">
                      <h4>Current Issues Preventing Peace</h4>
                      <p>{analysis.facts.current_issues_preventing_peace}</p>
                    </div>
                  )}
                </div>
              )}


              {analysis.possibility_of_peace && analysis.possibility_of_peace.length > 0 && (
                <div className="analysis-section hope">
                  <h3>Possibility of Peace</h3>
                  <p>{analysis.possibility_of_peace}</p>
                </div>
              )}

              {analysis.optimal_path_forward && analysis.optimal_path_forward.length > 0 && (
                <div className="analysis-section">
                  <h3>Optimal Path Forward</h3>
                  <p>{analysis.optimal_path_forward}</p>
                </div>
              )}

              {analysis.difficult_not_impossible && analysis.difficult_not_impossible.length > 0 && (
                <div className="analysis-section">
                  <h3>Challenges that make Peace & Prosperity Difficult But Not Impossible</h3>
                  <p>{analysis.difficult_not_impossible}</p>
                </div>
              )}
            </div>
          )}
        </Container>

        {error && (
          <div className="error-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        <Query userInput={userInput} setUserInput={setUserInput} handleAnalyzeConflict={handleAnalyzeConflict} />

      </Container>
    </>
  );
}