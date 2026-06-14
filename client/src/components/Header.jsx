import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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
        <Navbar.Brand href="./" aria-label="Link to the home page">
          <img src='./logo.png' alt="Idea Factory logo" />
        </Navbar.Brand>
        <Nav className='pb-3 pe-1'>
          { isHome ?
            <Nav.Link href="/ideas" aria-label="Link to the collection of ideas page">
              <FcGlobe className='icon'/>
            </Nav.Link>
          : 
            <Nav.Link href="/" aria-label="Link to the home page">
              <BiSolidHomeHeart className='icon home'/>
            </Nav.Link>
          }
        </Nav>
      </Navbar>
    </header>
  );
}