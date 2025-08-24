import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


export const System = ({item}) => {
  const content = item.content;
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateTool = (toolName) => {
    console.log(`Creating tool: ${toolName}`);
    // You can add actual tool creation logic here later
    alert(`To create ${toolName}, visit replit.com, and ask the Agent tool to help you build a prototype. Good luck, I am rooting for you! <3`);
  };

  const Share = async () => {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ })
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
        {content && (
            <div className="analysis-results">
                <div className="analysis-section">
                    {content.more_kindness_understanding_compassion && (
                      <div className="kindness-section">
                        <p><strong>💙 A message of support:</strong> {content.more_kindness_understanding_compassion}</p>
                      </div>
                    )}

                    {content.response && (
                      <div className="conflict-section">
                        <p>{content.response}</p>
                      </div>
                    )}
                  
                    {content.show_kindness_understanding_compassion && (
                      <div className="kindness-section">
                        <p><strong>💙 A message of support:</strong> {content.show_kindness_understanding_compassion}</p>
                      </div>
                    )}

                    {content.title && (
                      <h2 className='response-title'>{content.title}</h2>
                    )}

                    {content.conflict_identified && (
                      <div className="conflict-section">
                        <h3>Conflict Identified</h3>
                        <p>{content.conflict_identified}</p>
                      </div>
                    )}

                    {content["parties identified"] && content["parties identified"].length > 0 && (
                      <>
                        <h3>Parties Involved</h3>
                        <ul>
                          {content["parties identified"].map((party, index) => (
                            <li key={index}>{party}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {content.facts && (
                      <>
                        <h3>Summary of the Situation</h3>
                        {content.facts.historical_background && content.facts.historical_background.length > 0 && (
                          <div className="facts-subsection">
                            <h4>Historical Background</h4>
                            <ul>
                              {content.facts.historical_background.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {content.facts.current_issues_preventing_peace && content.facts.current_issues_preventing_peace.length > 0 && (
                          <div className="facts-subsection">
                            <h4>Current Issues</h4>
                            <ul>
                              {content.facts.current_issues_preventing_peace.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}

                    {content.realistic_trajectories && content.realistic_trajectories.length > 0 && (
                      <>
                        <h3>Realistic Trajectories</h3>
                        <div className="trajectories-list">
                          {content.realistic_trajectories.map((trajectory, index) => (
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

                    {content.new_options && content.new_options.length > 0 && (
                      <>
                        <h4 className="highlight">New Options & Possibilities</h4>
                        <div className="new-options-list">
                          {content.new_options.map((option, index) => (
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

                    {content.healing_needed && (
                      <>
                        <h3>Healing & Mindset Shifts Needed</h3>
                        <p>{content.healing_needed}</p>
                      </>
                    )}

                    {content.antagonists && (
                      <>
                        <h3>Potential Resistance</h3>
                        <p>{content.antagonists}</p>
                      </>
                    )}

                    {content.odds && (
                      <>
                        <h3>Possibility of Peace & Progress</h3>
                        <p>Assessment: {typeof content.odds === 'number' ? `${Math.round(content.odds * 100)}%` : content.odds}</p>
                      </>
                    )}

                    {content.tools && (
                      <>
                        <h4 className="highlight">Tools & Technology Solutions</h4>
                        {content.tools.existing && content.tools.existing.length > 0 && (
                          <div className="tools-subsection">
                            <h4>Existing Tools</h4>
                            <div className="existing-tools-list">
                              {content.tools.existing.map((tool, index) => (
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
                        {content.tools.new && content.tools.new.length > 0 && (
                          <div className="tools-subsection">
                            <h4>New Tool Ideas</h4>
                            <div className="new-tools-list">
                              {content.tools.new.map((tool, index) => (
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
