import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import { User } from './User'
import { System } from './System'


export const Response = ({conversation}) => {
  console.log('Response component received conversation:', conversation);
  
  // Handle empty or undefined conversation
  if (!conversation || conversation.length === 0) {
    return (
      <div className='scroll-box'>
        <Container>
          <p className="text-center text-muted">No conversation data available.</p>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className='scroll-box'>
        <Container>
          {conversation.map((item, index) =>
            item.role === 'user' ?
              <User key={index} item={item} />
            :
              <System key={index} item={item} />
          )}
        </Container>
      </div>
    </>
  )
}
