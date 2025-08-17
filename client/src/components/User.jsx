import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';


export const User = ({conversation}) => {
  const { input } = conversation.user;
  
  return (
    <>
        <Container>
            {input && (
              <div className="analysis-results">
                  <div className="user-input">
                    <p>{input}</p>
                  </div>
              </div>
            )}
        </Container>
    </>
  )
}