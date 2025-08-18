
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';


export const System = ({item}) => {
  const analysis = item.analysis;

  const handleCreateTool = (toolName) => {
    console.log(`Creating tool: ${toolName}`);
    // You can add actual tool creation logic here later
    alert(`Creating ${toolName}...`);
  };

  return (
    <>
        {analysis && (
            <div className="analysis-results">
                <div className="analysis-section">
                    {analysis.show_kindness_understanding_compassion && (
                      <div className="kindness-section" style={{backgroundColor: '#f8f9fa', padding: '15px', marginBottom: '20px', borderRadius: '8px', borderLeft: '4px solid #28a745'}}>
                        <p><strong>💚 A message of support:</strong> {analysis.show_kindness_understanding_compassion}</p>
                      </div>
                    )}

                    {analysis.title && (
                      <h2 style={{marginBottom: '20px', color: '#2c3e50'}}>{analysis.title}</h2>
                    )}

                    {analysis.conflict_identified && (
                      <div className="conflict-section">
                        <h3>Conflict Identified</h3>
                        <p>{analysis.conflict_identified}</p>
                      </div>
                    )}

                    {analysis["parties identified"] && analysis["parties identified"].length > 0 && (
                      <>
                        <h3>Parties Involved</h3>
                        <ul>
                          {analysis["parties identified"].map((party, index) => (
                            <li key={index}>{party}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {analysis.facts && (
                      <>
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
                      </>
                    )}

                    {analysis.realistic_trajectories && analysis.realistic_trajectories.length > 0 && (
                      <>
                        <h3>Realistic Trajectories</h3>
                        <div className="trajectories-list">
                          {analysis.realistic_trajectories.map((trajectory, index) => (
                            <div key={index} className="trajectory-item" style={{marginBottom: '15px', padding: '10px', border: '1px solid #dee2e6', borderRadius: '5px'}}>
                              {typeof trajectory === 'string' ? (
                                <p>{trajectory}</p>
                              ) : (
                                <>
                                  <h5>{trajectory.name}</h5>
                                  <p>{trajectory.description}</p>
                                  {trajectory.likelihood && (
                                    <small className="text-muted">Likelihood: {Math.round(trajectory.likelihood * 100)}%</small>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {analysis.new_options && analysis.new_options.length > 0 && (
                      <>
                        <h3>New Options & Possibilities</h3>
                        <div className="new-options-list">
                          {analysis.new_options.map((option, index) => (
                            <div key={index} className="option-item" style={{marginBottom: '15px', padding: '10px', border: '1px solid #dee2e6', borderRadius: '5px'}}>
                              {typeof option === 'string' ? (
                                <p>{option}</p>
                              ) : (
                                <>
                                  <h5>{option.tool}</h5>
                                  {option.how_it_helps && <p>{option.how_it_helps}</p>}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {analysis.healing_needed && (
                      <>
                        <h3>Healing & Mindset Shifts Needed</h3>
                        <p>{analysis.healing_needed}</p>
                      </>
                    )}

                    {analysis.antagonists && (
                      <>
                        <h3>Potential Resistance</h3>
                        <p>{analysis.antagonists}</p>
                      </>
                    )}

                    {analysis.odds && (
                      <>
                        <h3>Possibility of Peace & Progress</h3>
                        <p>Assessment: {typeof analysis.odds === 'number' ? `${Math.round(analysis.odds * 100)}%` : analysis.odds}</p>
                      </>
                    )}

                    {analysis.tools && (
                      <>
                        <h3>Tools & Technology Solutions</h3>
                        {analysis.tools.existing && analysis.tools.existing.length > 0 && (
                          <div className="tools-subsection">
                            <h4>Existing Tools</h4>
                            <div className="existing-tools-list">
                              {analysis.tools.existing.map((tool, index) => (
                                <div key={index} className="tool-item" style={{marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
                                  {typeof tool === 'string' ? (
                                    <span>{tool}</span>
                                  ) : (
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span>{tool.tool}</span>
                                      {tool.url && (
                                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                          Visit
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {analysis.tools.new && analysis.tools.new.length > 0 && (
                          <div className="tools-subsection">
                            <h4>New Tool Ideas</h4>
                            <div className="new-tools-list">
                              {analysis.tools.new.map((tool, index) => (
                                <div key={index} className="tool-item" style={{marginBottom: '10px', padding: '8px', backgroundColor: '#e8f5e8', borderRadius: '5px'}}>
                                  {typeof tool === 'string' ? (
                                    <span>{tool}</span>
                                  ) : (
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span>{tool.tool}</span>
                                      {tool.buildable_now === 'yes' && (
                                        <Button 
                                          variant="success" 
                                          size="sm"
                                          onClick={() => handleCreateTool(tool.tool)}
                                        >
                                          Create
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                </div>
            </div>
        )}
    </>
  )
}
