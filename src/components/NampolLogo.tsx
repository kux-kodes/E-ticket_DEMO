import React from 'react';

const NampolLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-12 h-12 ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="50" fill="#0033A0"/>
        <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" fill="#FFD700"/>
        <text x="50" y="58" fontFamily="Arial, sans-serif" fontSize="30" fill="#0033A0" textAnchor="middle" fontWeight="bold">NPF</text>
      </svg>
    </div>
  );
};

export default NampolLogo;