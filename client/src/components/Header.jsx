import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import { FcGlobe } from "react-icons/fc";
import { BiSolidHomeHeart } from "react-icons/bi";

export const Header = () => {
  const location = useLocation();
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    location.pathname === '/' ? setIsHome(true) : setIsHome(false)
  }, [location.pathname]);

  return (
    <header>
      <Navbar className='d-flex justify-content-between align-items-end w-100 px-2'>
        <Navbar.Brand href="./" className=''>
          <img src='../public/logo.png' />
        </Navbar.Brand>
        <Nav className='pb-3 pe-1'>
          { isHome ?
            <Nav.Link href="/events">
              <FcGlobe className='icon'/>
            </Nav.Link>
          : 
            <Nav.Link href="/">
              <BiSolidHomeHeart className='icon home'/>
            </Nav.Link>
          }
        </Nav>
      </Navbar>
    </header>
  );
}