import React from 'react';

export const PurviewXLogo: React.FC<{ className?: string }> = ({ className }) => {
  const logoColor = "#00A9FF"; // A bright blue to match the image

  return (
    <svg
      viewBox="0 0 230 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 3px rgba(0, 169, 255, 0.6))' }}
    >
      <g fill={logoColor}>
        {/* Icon: A modern shield shape with an inset checkmark */}
        <g transform="translate(0, 3) scale(1.2)">
          <path d="M16 0 L0 6 L0 18 C0 24.3 10.7 31 16 31 C21.3 31 32 24.3 32 18 L32 6 Z" />
          <path d="M13.5 21 L8.5 16 L10 14.5 L13.5 18 L22 9.5 L23.5 11 Z" fill="white" />
        </g>
        
        {/* Text "PurviewX" inside a rounded rectangle outline */}
        <g transform="translate(50, 0)">
          <rect 
            x="0" 
            y="7" 
            width="175" 
            height="26" 
            rx="6" 
            ry="6" 
            fill="none" 
            stroke={logoColor} 
            strokeWidth="2.5"
          />
          <text 
            x="87.5"
            y="27"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            fontSize="19" 
            fontWeight="600" 
            fill={logoColor} 
            textAnchor="middle"
            letterSpacing="0.5"
          >
            PurviewX
          </text>
        </g>
      </g>
    </svg>
  );
};
