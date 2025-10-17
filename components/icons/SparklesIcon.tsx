
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M18 9h.01" />
    <path d="M15 6h.01" />
    <path d="M19.5 13.5h.01" />
    <path d="M19.5 8.5h.01" />
    <path d="M15 12h.01" />
    <path d="m21 21-6-6" />
  </svg>
);

export default SparklesIcon;
