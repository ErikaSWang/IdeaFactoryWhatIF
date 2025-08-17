import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

export const Spinner = () => {
  return (
    <figure>
      <DotLottieReact
        src="https://lottie.host/fb02b621-4051-40ea-9171-59b228a75f30/LlzrXDpXcW.lottie"
        loop
        autoplay
        className="spinner"
      />
    </figure>
  )
}