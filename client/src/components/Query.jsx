import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

export const Query = ({ userInput, setUserInput, handleAnalyzeConflict }) => {
  
  return (
    <footer>
      <Container className="d-flex flex-column justify-content-center input-section">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="A place to unload ... what's on your mind?"
          className="conflict-input"
        />
          <Button 
            onClick={handleAnalyzeConflict} 
            className="shadow-lg analyze-button my-3"
          >Are Peace & Progress Possible?
          </Button>
      </Container>
    </footer>
  )
}