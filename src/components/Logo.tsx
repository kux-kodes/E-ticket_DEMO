import React, { useState } from 'react';
import logoImage from '../assets/logo.png';

const Logo = ({ 
  size = "6xl", 
  className = "" 
}: { 
  size?: "small" | "medium" | "large" | "lgPlus" | "xl" | "xxl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "10xl", 
  className?: string 
}) => {
  const [hasError, setHasError] = useState(false);
  
   const sizeClasses = {
    small: "w-10 h-10",        // 40px
    medium: "w-14 h-14",      // 56px
    large: "w-20 h-20",       // 80px
    lgPlus: "w-24 h-24",      // 96px
    xl: "w-28 h-28",          // 112px
    xxl: "w-32 h-32",         // 128px
    "3xl": "w-36 h-36",       // 144px
    "4xl": "w-40 h-40",       // 160px
    "5xl": "w-44 h-44",       // 176px
    "6xl": "w-48 h-48",       // 192px
    "7xl": "w-52 h-52",       // 208px
    "8xl": "w-56 h-56",       // 224px
    "9xl": "w-60 h-60",       // 240px
    "10xl": "w-64 h-64",      // 256px
  };

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden`}>
      <img 
        src={hasError ? "/placeholder-logo.png" : logoImage} 
        alt="Logo" 
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
    
  );
};

export default Logo;
