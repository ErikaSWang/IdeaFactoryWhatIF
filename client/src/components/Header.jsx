import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

export const Header = () => {

  return (
    <>
      <Navbar className='d-flex justify-content-between align-items-end w-100 px-2'>
        <Navbar.Brand href="./" className=''>
          <img src='../public/logo.png' />
        </Navbar.Brand>
        <Nav className='pb-3'>
          <Nav.Link href="/events">
            <FcGlobe className='icon'/>
          </Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}