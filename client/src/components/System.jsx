
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';


export const System = ({conversation}) => {
  const analysis = conversation.analysis || conversation.response;
  
  return (
    <>
            {analysis && (
              <div className="analysis-results">
                {analysis.title && (
                  <div className="analysis-section">
                    <h2>{analysis.title}</h2>
                  </div>
                )}

                {analysis.conflict_identified && (
                  <div className="analysis-section">
                    <h3>Conflict Identified</h3>
                    <p>{analysis.conflict_identified}</p>
                  </div>
                )}

                {analysis["parties identified"] && analysis["parties identified"].length > 0 && (
                  <div className="analysis-section">
                    <h3>Parties Involved</h3>
                    <ul>
                      {analysis["parties identified"].map((party, index) => (
                        <li key={index}>{party}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.facts && (
                  <div className="analysis-section">
                    <h3>Summary of the Situation</h3>
                    {analysis.facts.historical_background && analysis.facts.historical_background.length > 0 && (
                      <div className="facts-subsection">
                        <h4>Historical Background</h4>
                        <ul>
                          {analysis.facts.historical_background.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.facts.current_issues_preventing_peace && analysis.facts.current_issues_preventing_peace.length > 0 && (
                      <div className="facts-subsection">
                        <h4>Current Issues</h4>
                        <ul>
                          {analysis.facts.current_issues_preventing_peace.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {analysis.realistic_trajectories && analysis.realistic_trajectories.length > 0 && (
                  <div className="analysis-section">
                    <h3>Realistic Trajectories</h3>
                    <ul>
                      {analysis.realistic_trajectories.map((trajectory, index) => (
                        <li key={index}>{trajectory}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.new_options && analysis.new_options.length > 0 && (
                  <div className="analysis-section hope">
                    <h3>New Options & Possibilities</h3>
                    <ul>
                      {analysis.new_options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.healing_needed && (
                  <div className="analysis-section">
                    <h3>Healing & Mindset Shifts Needed</h3>
                    <p>{analysis.healing_needed}</p>
                  </div>
                )}

                {analysis.antagonists && (
                  <div className="analysis-section">
                    <h3>Potential Resistance</h3>
                    <p>{analysis.antagonists}</p>
                  </div>
                )}

                {analysis.odds && (
                  <div className="analysis-section hope">
                    <h3>Possibility of Peace & Progress</h3>
                    <p>Assessment: {typeof analysis.odds === 'number' ? `${Math.round(analysis.odds * 100)}%` : analysis.odds}</p>
                  </div>
                )}

                {analysis.tools && (
                  <div className="analysis-section">
                    <h3>Tools & Technology Solutions</h3>
                    {analysis.tools.existing && analysis.tools.existing.length > 0 && (
                      <div className="tools-subsection">
                        <h4>Existing Tools</h4>
                        <ul>
                          {analysis.tools.existing.map((tool, index) => (
                            <li key={index}>{tool}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.tools.new && analysis.tools.new.length > 0 && (
                      <div className="tools-subsection">
                        <h4>New Tool Ideas</h4>
                        <ul>
                          {analysis.tools.new.map((tool, index) => (
                            <li key={index}>{tool}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
    </>
  )
}
