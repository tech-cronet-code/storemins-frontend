// ShareButton.tsx
import React from "react";

const ShareButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Share product"
    className="absolute top-2 right-2 p-2 rounded-full bg-white border shadow hover:shadow-md transition flex items-center justify-center"
  >
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 6l-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

export default ShareButton;
