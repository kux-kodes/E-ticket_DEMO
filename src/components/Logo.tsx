import React, { useState } from 'react';
import logoImage from '../assets/logo.jpg';

const Logo = ({ size = "medium", className = "" }: { size?: "small" | "medium" | "large" | "xl", className?: string }) => {
  const [hasError, setHasError] = useState(false);
  
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xl: "w-20 h-20"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden border-2 border-gray-300`}>
      <img 
        src={hasError ? "/placeholder-logo.jpg" : logoImage} 
        alt="Logo" 
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default Logo;