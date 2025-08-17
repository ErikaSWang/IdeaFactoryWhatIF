import React, { useState, useEffect } from 'react';
import { suggestions } from '../assets/database';

export const Fresh = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out animation
      setIsVisible(false);
      
      // After fade out completes, change to next item and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 300); // 300ms for fade out
      
    }, 3000); // Change item every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <section className='d-flex justify-content-center align-items-center p-4'>
      <div 
        className={`suggestion-slideshow ${isVisible ? 'visible' : 'hidden'}`}
        key={currentIndex}
      >
        {suggestions[currentIndex]}
      </div>
    </section>
  )
}
