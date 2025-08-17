import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import { User } from './User'
import { System } from './System'


export const Response = ({conversation}) => {
  return (
    <>
      <div className='scroll-box'>
        <Container>
          {conversation.map((conversation, index) =>
            Object.entries === 'user' ?
              <User key={index} conversation={conversation} />
            :
              <System key={index} conversation={conversation} />
          )}
        </Container>
      </div>
    </>
  )
}
