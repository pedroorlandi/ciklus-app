import React from "react";

interface LogoProps {
  onClick?: () => void;
}

const Logo = ({ onClick }: LogoProps) => {
  return (
    <div 
      className="cursor-pointer transition-transform hover:scale-105" 
      onClick={onClick}
    >
      <img
        src="/color_logo_transparent.png"
        alt="Ciklus Logo"
        className="h-8 lg:h-10 w-auto object-contain"
        loading="eager"
      />
    </div>
  );
};

export default Logo;