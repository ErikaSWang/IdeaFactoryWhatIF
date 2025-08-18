import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Loading } from '../components/Loading';

export const Events = () => {
  const [publicShares, setPublicShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      const data = await response.json();
      console.log('Fetched public shares:', data);
      if (data.length > 0) {
        console.log('First share tools structure:', data[0].tools);
      }
      setPublicShares(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching public shares:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
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

            <h3 className="text-center event-header pb-3">🌍 Community concerns and tool suggestions </h3>

        {publicShares.length === 0 ? (
            <>
              <h5>No Shared Analyses Yet</h5>
              <p>Be the first to share your conflict analysis with the world!</p>
            </>
        ) : (
            <div className="d-flex flex-wrap gap-4 justify-content-center">
              {publicShares.map((share, index) => (
                <div key={share.id || index} className="flex-fill" style={{ minWidth: '300px', maxWidth: '400px' }}>
                  <Card className="h-100 custom-bg shadow-lg">        
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
                  </Card>
                </div>
              ))}
            </div>
        )}
      </Container>
    </>
  );
}