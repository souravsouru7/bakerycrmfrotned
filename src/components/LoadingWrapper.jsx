import React from 'react';

const LoadingWrapper = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  return children;
};

export default LoadingWrapper; 