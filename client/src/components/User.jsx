import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';


export const User = ({item}) => {
  const content = item.content;
  
  return (
    <>
        <Container className='d-flex justify-content-right'>
            {content && (
              <div className="analysis-results">
                  <div className="d-flex justify-content-right user-input">
                    {content}
                  </div>
              </div>
            )}
        </Container>
    </>
  )
}
