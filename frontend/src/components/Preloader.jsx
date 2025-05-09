import React from 'react';
import './Preloader.css'; // หรือใช้ Tailwind ก็ได้

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="spinner"></div>
    </div>
  );
};

export default Preloader;
