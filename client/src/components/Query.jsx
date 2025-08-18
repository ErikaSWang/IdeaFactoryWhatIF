import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

export const Query = ({ userInput, setUserInput, handleAnalyzeConflict, handleFollowUp, onTextareaHeightChange, response, setResponse }) => {
  const textareaRef = useRef(null);
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        if (onTextareaHeightChange) {
          onTextareaHeightChange(height);
        }
      }
    });

    resizeObserver.observe(textarea);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onTextareaHeightChange]);
  
  return (
    <footer>
      <Container className="d-flex flex-column justify-content-center input-section">
        { !response ?
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="A place to unload ... what's on your mind?"
              className="conflict-input"
            />
        :
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Please feel free to ask another question."
              className="conflict-input"
            />
        }
        
        { !response ?
            <Button 
              onClick={handleAnalyzeConflict} 
              className="shadow-lg analyze-button my-3"
            >Are Peace & Progress Possible?
            </Button>
         : 
            <Button 
              onClick={handleFollowUp} 
              className="shadow-lg continue-button my-3"
            >You've Got this ❤
            </Button>
        }
          
      </Container>
    </footer>
  )
}