export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4DA0" />
          <stop offset="100%" stopColor="#7B2FFF" />
        </linearGradient>
      </defs>

      <g transform="rotate(15 24 24)">
        {/* Globe outline */}
        <circle cx="24" cy="24" r="18" fill="none" stroke="url(#globeGrad)" strokeWidth="2.5" />
        {/* Equator */}
        <path d="M6 24H42" fill="none" stroke="url(#globeGrad)" strokeOpacity="0.8" strokeWidth="1.8" />
        {/* Latitude lines */}
        <path d="M9 15C15 17.5 33 17.5 39 15" fill="none" stroke="url(#globeGrad)" strokeOpacity="0.5" strokeWidth="1.4" />
        <path d="M9 33C15 30.5 33 30.5 39 33" fill="none" stroke="url(#globeGrad)" strokeOpacity="0.5" strokeWidth="1.4" />
        {/* Meridians */}
        <path d="M24 6C18 12 15.5 18 15.5 24C15.5 30 18 36 24 42" fill="none" stroke="url(#globeGrad)" strokeOpacity="0.7" strokeWidth="1.6" />
        <path d="M24 6C30 12 32.5 18 32.5 24C32.5 30 30 36 24 42" fill="none" stroke="url(#globeGrad)" strokeOpacity="0.7" strokeWidth="1.6" />
      </g>
    </svg>
  );
}
