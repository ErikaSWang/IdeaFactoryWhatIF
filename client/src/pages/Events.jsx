import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { Response } from '../components/Response';

export const Events = () => {
  const [publicShares, setPublicShares] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const handleCreateTool = (toolName) => {
    console.log(`Creating tool: ${toolName}`);
    // You can add actual tool creation logic here later
    alert(`To create ${toolName}, visit replit.com, and ask the Agent tool to help you build a prototype. Good luck, I am rooting for you! <3`);
  };

  useEffect(() => {
    fetchPublicShares();
  }, []);

  const fetchPublicShares = async () => {
    try {
      const response = await fetch('/api/public');

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      /*
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/public');

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      */

      const data = await response.json();
      console.log('Fetched public shares:', data);
      if (data.length > 0) {
        console.log('First share tools structure:', data[0].tools);
      }
      setPublicShares(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching public shares:', err);
    }
  };


  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center h-50">
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Error Loading Shares</Card.Title>
            <Card.Text>Unable to load shared analyses: {error}</Card.Text>
            <Button variant="primary" onClick={fetchPublicShares}>Try Again</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Container className="main-component py-4">
            <h3 className="text-center event-header pb-3">🌍 Community Concerns and Tool Suggestions </h3>

        {publicShares.length === 0 ? (
            <div className='d-flex flex-column justify-content-center text-center text-light w-100'>
              <h5 className='p-2'>No Shares</h5>
              <p>Be the first to share your concerns with the world!</p>
            </div>
        ) : (
            <div className="d-flex flex-wrap justify-content-center">
              {publicShares.map((share, index) => (
                  <Card key={share.id || index} className="card p-2 m-2 custom-bg shadow-lg">        
                    <Card.Header className="card-heading" title={share.user_input}>
                      <h5>
                      {share.user_input}
                      </h5>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column">
                      <Card.Text className="text-muted small">
                        Shared on {new Date(share.created_at).toLocaleDateString()}
                      </Card.Text>

                      {share.tools && share.tools.existing && share.tools.existing.length > 0 && (
                        <div className="mb-3">
                          <h6>Existing Tools:</h6>
                          <ul className="list-unstyled">
                            {share.tools.existing.map((tool, toolIndex) => (
                              <li key={toolIndex} className="small mb-1">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>• {typeof tool === 'string' ? tool : tool.tool}</span>
                                  {typeof tool === 'object' && tool.url && (
                                    <a 
                                      href={tool.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="btn btn-xs btn-outline-primary"
                                      style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem' }}
                                    >
                                      Visit
                                    </a>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {share.tools && share.tools.new && share.tools.new.length > 0 && (
                        <div className="mb-3">
                          <h6>New Tool Ideas:</h6>
                          <ul className="list-unstyled">
                            {share.tools.new.map((tool, toolIndex) => (
                              <li key={toolIndex} className="small mb-1">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>• {typeof tool === 'string' ? tool : tool.tool}</span>
                                  <div>
                                    {typeof tool === 'object' && tool.buildable === 'yes' && (
                                      <Button
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => handleCreateTool(tool.tool)}
                                      >
                                        Create
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card.Body>
                    <Card.Footer className='d-flex justify-content-end'>
                      <Button variant='success' onClick={setShow(true)}>See Full Conversation</Button>
                      <Modal
                        size="lg"
                        show={show}
                        onHide={() => setShow(false)}
                        aria-labelledby="example-modal-sizes-title-lg"
                        className='bg-secondary'
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="example-modal-sizes-title-lg">
                            Full Conversation
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Response conversation={share.conversation} />
                        </Modal.Body>
                      </Modal>
                    </Card.Footer>
                  </Card>
                ))
              }
            </div>
        )}
      </Container>
    </>
  );
}