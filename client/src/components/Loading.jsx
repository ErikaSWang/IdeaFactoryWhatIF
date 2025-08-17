import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const Spinner = () => {
  const handleLoadError = () => {
    console.log('Lottie animation failed to load');
  };

  return (
    <figure className="spinner-container">
      <DotLottieReact
        src="https://lottie.host/fb02b621-4051-40ea-9171-59b228a75f30/LlzrXDpXcW.lottie"
        loop={true}
        autoplay={true}
        className="spinner"
        onLoadError={handleLoadError}
      />
    </figure>
  );
};