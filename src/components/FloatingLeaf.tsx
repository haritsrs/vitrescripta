"use client";

import React, { useEffect } from 'react';

// Single leaf component
const Leaf = ({ delay = 0 }) => {
  const style = {
    position: 'absolute',
    left: `${Math.random() * 100}%`,
    animationDuration: `${15 + Math.random() * 15}s`,
    animationDelay: `${delay}s`,
    animationFillMode: 'forwards',
    animationTimingFunction: 'linear',
    animationName: 'float',
    width: '20px',
    height: '20px',
    opacity: 0,
  };

  return (
    <div style={style as React.CSSProperties}>
      <svg 
        viewBox="0 0 24 24" 
        width="100%" 
        height="100%" 
        className="text-gold-600/40"
        style={{
          animation: `swayLeaf ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
        }}
      >
        <path 
          fill="currentColor" 
          d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" 
        />
      </svg>
    </div>
  );
};

// Container component
const FloatingLeaves = ({ count = 8 }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <Leaf key={i} delay={i * 1.5} />
      ))}
    </div>
  );
};

export default FloatingLeaves;