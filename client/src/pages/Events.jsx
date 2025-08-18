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

  useEffect(() => {
    fetchPublicShares();
  }, []);

  const fetchPublicShares = async () => {
    try {
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/public');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
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
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">🌍 Shared with the World</h2>
            <p className="text-center text-muted">Community analyses and tool suggestions</p>
          </Col>
        </Row>

        {publicShares.length === 0 ? (
          <Row>
            <Col className="text-center">
              <Card>
                <Card.Body>
                  <Card.Title>No Shared Analyses Yet</Card.Title>
                  <Card.Text>Be the first to share your conflict analysis with the world!</Card.Text>
                  <Button variant="primary" href="/">Start an Analysis</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            {publicShares.map((share, index) => (
              <Col md={6} lg={4} className="mb-4" key={share.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate" title={share.user_input}>
                      {share.user_input.length > 60 
                        ? `${share.user_input.substring(0, 60)}...` 
                        : share.user_input
                      }
                    </Card.Title>
                    
                    <Card.Text className="text-muted small">
                      Shared on {new Date(share.created_at).toLocaleDateString()}
                    </Card.Text>

                    {share.tools && share.tools.existing && share.tools.existing.length > 0 && (
                      <div className="mb-3">
                        <h6>🔧 Existing Tools:</h6>
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
                        <h6>💡 New Tool Ideas:</h6>
                        <ul className="list-unstyled">
                          {share.tools.new.map((tool, toolIndex) => (
                            <li key={toolIndex} className="small mb-1">
                              <div className="d-flex justify-content-between align-items-center">
                                <span>• {typeof tool === 'string' ? tool : tool.tool}</span>
                                <div>
                                  {typeof tool === 'object' && tool.buildable === 'yes' && (
                                    <span className="text-success small">✓ Buildable</span>
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
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}