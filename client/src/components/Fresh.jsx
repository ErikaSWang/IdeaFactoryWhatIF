import React, { useState, useEffect } from 'react';
import { suggestions } from '../assets/database';


export const Fresh = () => {
  return (
    <section className='d-flex justify-content-center align-items-center p-4'>
      {suggestions.map((suggestion, index) => (
        <div key={index} className='suggestion'>
          {suggestion}
        </div>
      ))}
    </section>
  )
}