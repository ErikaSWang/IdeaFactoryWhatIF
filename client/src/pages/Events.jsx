import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';



export const Events = () => {
  const [events, setEvents] = useState([]);

  return (
    <>

      <Container className='d-flex flex-col align-content-between flex-wrap main-component'>

        <Container className='d-flex flex-col output'>
          
        </Container>

        {error && (
          <div className="error-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

      </Container>
    </>
  );
}