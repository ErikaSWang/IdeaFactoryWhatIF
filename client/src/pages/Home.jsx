import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import { Query } from "../components/Query";
import { Fresh } from "../components/Fresh";
import { Loading } from "../components/Loading";
import { Response } from "../components/Response";

export const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [fresh, setFresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);
  const [textareaHeight, setTextareaHeight] = useState(0);
  const [outputHeight, setOutputHeight] = useState('50vh');
  const [popup, setPopup] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      setFresh(true);
    }, 500);
  }, []);

  useEffect(() => {
    const calculateOutputHeight = () => {
      const windowHeight = window.innerHeight;
      const headerHeightVh = 20; // From index.css: header { height: 20vh; }
      const footerMinHeightVh = 20; // From index.css: footer { min-height: 20vh; }
      
      // Calculate actual footer height in vh
      const footerHeightPx = textareaHeight + 120; // Textarea + button + padding
      const footerActualVh = Math.max(footerMinHeightVh, (footerHeightPx / windowHeight) * 100);
      
      // Available space = 100vh - header - footer
      const availableVh = 100 - headerHeightVh - footerActualVh;
      
      // Ensure minimum height of 15vh and maximum of 55vh
      const clampedHeight = Math.max(15, Math.min(55, availableVh));
      setOutputHeight(`${clampedHeight}vh`);
    };

    calculateOutputHeight();
    window.addEventListener('resize', calculateOutputHeight);
    
    return () => window.removeEventListener('resize', calculateOutputHeight);
  }, [textareaHeight]);


  
  const handleAnalyzeConflict = async () => {
    if (!userInput.trim()) {
      setError('Please enter information about a conflict to analyze.');
      return;
    }
    setTimeout(() => {
      setFresh(false);
      setLoading(true);
    }, 500);

    setError(null);

    try {
      const response = await fetch('/api/analyze-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      /*
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/analyze-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });
      */

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      setLoading(false);
      setAnalysis(result.analysis);
      setConversation(prevConversation => [
        ...prevConversation, 
        { role: 'user', content: userInput },
        { role: 'system', content: result.analysis }
      ])
      setResponse(true);
      setUserInput('');

    } catch (error) {
      console.error('Error analyzing conflict:', error);
      setError(`Error: ${error.message}. Please notify the administrator.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!userInput.trim()) {
      setError('Please enter information about a conflict to analyze.');
      return;
    }

    setError(null);

    try {
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      /*
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });
      */

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      setAnalysis(result.analysis);
      setConversation(prevConversation => [
        ...prevConversation, 
        { role: 'user', content: userInput },
        { role: 'system', content: result.analysis }
      ])
      setUserInput('');

    } catch (error) {
      console.error('Error analyzing conflict:', error);
      setError(`Error: ${error.message}. Please notify the administrator.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('conversation:', conversation)
  }, [conversation])



  return (
    <>
      <Container className='d-flex flex-col justify-content-center align-content-between flex-wrap main-component'>

        <Container 
          className='d-flex flex-col justify-content-center output'
          style={{ height: outputHeight }}
        >
          { fresh ?
              <Fresh />
            : 
              loading ?
                <Loading />
              :
                <Response conversation={conversation} popup={popup} />
          }
        </Container>

        {error && (
          <div className="error-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        <Query 
          userInput={userInput} 
          setUserInput={setUserInput} 
          handleAnalyzeConflict={handleAnalyzeConflict}
          handleFollowUp={handleFollowUp}
          onTextareaHeightChange={setTextareaHeight}
          response={response}
          setResponse={setResponse}
        />

      </Container>
    </>
  );
}