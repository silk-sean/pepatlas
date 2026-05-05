import { ImageResponse } from "next/og";

// iOS home screen icon: dark tile, pink→purple globe wireframe, 180×180.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4DA0" />
              <stop offset="100%" stopColor="#7B2FFF" />
            </linearGradient>
          </defs>
          <g transform="rotate(15 24 24)">
            <circle cx="24" cy="24" r="18" fill="none" stroke="url(#g)" strokeWidth="2.8" />
            <path d="M6 24H42" stroke="url(#g)" strokeOpacity="0.85" strokeWidth="2" />
            <path d="M9 15C15 17.5 33 17.5 39 15" stroke="url(#g)" strokeOpacity="0.55" strokeWidth="1.6" />
            <path d="M9 33C15 30.5 33 30.5 39 33" stroke="url(#g)" strokeOpacity="0.55" strokeWidth="1.6" />
            <path
              d="M24 6C18 12 15.5 18 15.5 24C15.5 30 18 36 24 42"
              stroke="url(#g)"
              strokeOpacity="0.75"
              strokeWidth="1.8"
              fill="none"
            />
            <path
              d="M24 6C30 12 32.5 18 32.5 24C32.5 30 30 36 24 42"
              stroke="url(#g)"
              strokeOpacity="0.75"
              strokeWidth="1.8"
              fill="none"
            />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
