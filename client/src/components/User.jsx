
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';


export const User = ({item}) => {
  const input = item.input;
  
  return (
    <>
        <Container className='d-flex justify-content-right'>
            {input && (
              <div className="analysis-results">
                  <div className="d-flex justify-content-right user-input">
                    <p>{input}</p>
                  </div>
              </div>
            )}
        </Container>
    </>
  )
}
