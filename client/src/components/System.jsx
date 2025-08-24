
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


export const System = ({item}) => {
  const analysis = item.analysis;
  const [showToast, setShowToast] = useState(false);

  const handleCreateTool = (toolName) => {
    console.log(`Creating tool: ${toolName}`);
    // You can add actual tool creation logic here later
    alert(`To create ${toolName}, visit replit.com, and ask the Agent tool to help you build a prototype. Good luck, I am rooting for you! <3`);
  };

  const Share = async () => {
    try {
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      /*
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });
      */

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Show success toast
      setShowToast(true);

    } catch (error) {
      console.error('Error sharing:', error);
      setError(`Error: ${error.message}. Please notify the administrator.`);
    }
  };

  return (
    <>
        {analysis && (
            <div className="analysis-results">
                <div className="analysis-section">
                    {analysis.more_kindness_understanding_compassion && (
                      <div className="kindness-section">
                        <p><strong>💙 A message of support:</strong> {analysis.more_kindness_understanding_compassion}</p>
                      </div>
                    )}

                    {analysis.response && (
                      <div className="conflict-section">
                        <p>{analysis.response}</p>
                      </div>
                    )}
                  
                    {analysis.show_kindness_understanding_compassion && (
                      <div className="kindness-section">
                        <p><strong>💙 A message of support:</strong> {analysis.show_kindness_understanding_compassion}</p>
                      </div>
                    )}

                    {analysis.title && (
                      <h2 className='response-title'>{analysis.title}</h2>
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
                            <div key={index} className="trajectory-item">
                              {typeof trajectory === 'string' ? (
                                <p>{trajectory}</p>
                              ) : (
                                <>
                                  <h4 className="subheadings">{trajectory.name}</h4>
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
                        <h4 className="highlight">New Options & Possibilities</h4>
                        <div className="new-options-list">
                          {analysis.new_options.map((option, index) => (
                            <div key={index} className="option-item">
                              {typeof option === 'string' ? (
                                <p>{option}</p>
                              ) : (
                                <>
                                    <h4 className="subheadings">{option.name}</h4>
                                    <p>{option.description}</p>
                                    {option.likelihood && (
                                      <small className="text-muted">Likelihood: {Math.round(option.likelihood * 100)}%</small>
                                    )}
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
                        <h4 className="highlight">Tools & Technology Solutions</h4>
                        {analysis.tools.existing && analysis.tools.existing.length > 0 && (
                          <div className="tools-subsection">
                            <h4>Existing Tools</h4>
                            <div className="existing-tools-list">
                              {analysis.tools.existing.map((tool, index) => (
                                <div key={index} className="existing-tool">
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
                                <div key={index} className="new-tool">
                                  {typeof tool === 'string' ? (
                                    <span>{tool}</span>
                                  ) : (
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span>{tool.tool}</span>
                                      {tool.buildable === 'yes' && (
                                        <Button
                                          variant="primary" 
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
                <div className="d-flex justify-content-end w-100 pe-5 pb-3">
                  <Button variant="success" className="d-flex justify-content-end" onClick={Share}>Share with the World</Button>
                </div>
            </div>
        )}

        <ToastContainer position="bottom-end" className="p-3">
          <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">✅ Success!</strong>
            </Toast.Header>
            <Toast.Body>
              Your analysis has been shared with the world!
            </Toast.Body>
          </Toast>
        </ToastContainer>
    </>
  )
}
