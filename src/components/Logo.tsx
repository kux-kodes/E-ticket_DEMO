import React from 'react';

const Logo = ({ size = "medium", className = "" }: { size?: "small" | "medium" | "large" | "xl", className?: string }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xl: "w-20 h-20"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          className="fill-primary stroke-primary-foreground"
          strokeWidth="4"
        />
        
        {/* D letter design */}
        <path
          d="M30 25 L30 75 L55 75 C65 75 70 65 70 50 C70 35 65 25 55 25 L30 25 Z"
          className="fill-primary-foreground"
        />
        
        {/* Inner accent */}
        <path
          d="M35 35 L35 65 L50 65 C57 65 60 60 60 50 C60 40 57 35 50 35 L35 35 Z"
          className="fill-primary"
        />
      </svg>
    </div>
  );
};

export default Logo;