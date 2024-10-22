// import React from 'react';

// const Spinner = () => {
//   return (
//     <div className="flex items-center justify-center h-40">  {/* Set fixed height */}
//   <div className="loader"></div>
//   <style jsx>{`
//     .loader {
//       border: 4px solid #f3f3f3;
//       border-top: 4px solid #3498db;
//       border-radius: 50%;
//       width: 40px;
//       height: 40px;
//       animation: spin 1s linear infinite;
//     }

//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `}</style>
// </div>
//   );
// };


// export default Spinner;

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
