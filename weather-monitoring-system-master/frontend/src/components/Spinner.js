

import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../animations/spinners.json'; // Your Lottie animation file

const Spinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="flex items-center justify-center h-40">
      <Lottie options={defaultOptions} height={175} width={175} />
    </div>
  );
};

export default Spinner;
