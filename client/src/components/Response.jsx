
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
          {conversation.map((item, index) =>
            item.type === 'user' ?
              <User key={index} item={item} />
            :
              <System key={index} item={item} conversation={conversation} />
          )}
        </Container>
      </div>
    </>
  )
}
