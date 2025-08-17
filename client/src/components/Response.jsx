import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

export const Response = ({analysis}) => {
  return (
    <>
      {analysis && (
        <div className="analysis-results">

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
    </>
  )
}