
import React, { Suspense, lazy } from 'react';

// Lazy load the DotLottie component
const DotLottieReact = lazy(() => 
  import('@lottiefiles/dotlottie-react').then(module => ({
    default: module.DotLottieReact
  }))
);

export const Loading = () => {
  const handleLoadError = () => {
    console.log('Lottie animation failed to load');
  };

  return (
    <figure className="d-flex justify-content-center align-items-center spinner-container">
      <Suspense fallback={<div>Loading animation...</div>}>
        <DotLottieReact
          src="https://lottie.host/fb02b621-4051-40ea-9171-59b228a75f30/LlzrXDpXcW.lottie"
          loop={true}
          autoplay={true}
          className="spinner"
          onLoadError={handleLoadError}
        />
      </Suspense>
    </figure>
  );
};
