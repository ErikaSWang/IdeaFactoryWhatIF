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
  const [fresh, setFresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [returned, setReturned] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    
  }, []);

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
      const response = await fetch('/api/analyze-conflict', {
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