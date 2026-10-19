import React from 'react';

interface TechIconProps {
  size?: number;
  className?: string;
}

// ── Official SVG Brand Icons (Accurate, Authentic & Recognized) ───────

export const ReactIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 115.3 100"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <ellipse cx="57.65" cy="50" rx="10.5" ry="10.5" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="4.5" fill="none">
      <ellipse cx="57.65" cy="50" rx="55" ry="21" />
      <ellipse cx="57.65" cy="50" rx="55" ry="21" transform="rotate(60 57.65 50)" />
      <ellipse cx="57.65" cy="50" rx="55" ry="21" transform="rotate(120 57.65 50)" />
    </g>
  </svg>
);

export const NodeIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <path
      stroke="#539E43"
      strokeWidth="2.4"
      strokeLinejoin="round"
      d="M16 2.4l11.5 6.6v13.2L16 28.8 4.5 22.2V9L16 2.4z"
    />
    <g fill="#539E43">
      <path d="M12.2 12.2v6.2c0 1.5-.7 2.3-2 2.3-.6 0-1.2-.2-1.7-.5l-.4 1.4c.7.4 1.5.6 2.3.6 2.2 0 3.5-1.3 3.5-3.6v-6.4h-1.7z" />
      <path d="M16.5 19.3c.7.5 1.5.8 2.3.8 1.1 0 1.8-.6 1.8-1.4 0-.8-.6-1.2-1.9-1.7-1.7-.6-2.7-1.4-2.7-2.7 0-1.6 1.3-2.7 3.3-2.7.9 0 1.7.2 2.3.6l-.5 1.4c-.6-.4-1.3-.6-2-.6-1.1 0-1.6.6-1.6 1.2 0 .7.5 1.1 1.8 1.6 1.8.6 2.8 1.4 2.8 2.8 0 1.7-1.3 2.9-3.5 2.9-1 0-2-.3-2.7-.8l.7-1.2z" />
    </g>
  </svg>
);

export const NextIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 180 180"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <circle cx="90" cy="90" r="86" fill="#000000" stroke="rgba(255,255,255,0.28)" strokeWidth="5" />
    <path
      d="M149.5 157.5L69.1 54H54v72h12.1V69.4l73.9 95.5c3.3-2.2 6.5-4.7 9.5-7.4z"
      fill="url(#nextG1)"
    />
    <rect x="115" y="54" width="12" height="72" fill="url(#nextG2)" />
    <defs>
      <linearGradient id="nextG1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="nextG2" x1="121" y1="54" x2="120.8" y2="106.9" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const TypeScriptIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="128" height="128" rx="20" fill="#3178C6" />
    <path
      fill="#FFFFFF"
      d="M38.8 62.9h14.7v49.8H67V62.9h14.7V50.4H38.8v12.5zm43.3 35.8c3.8 2.6 8.3 4.2 13.5 4.2 7.7 0 12.3-3.8 12.3-9.5 0-5.7-4.4-8.2-12.1-11.5-11-4.7-16.1-9.9-16.1-19.1 0-10.4 8.5-18 22.3-18 6.7 0 12.4 1.9 16.7 4.9l-4.1 11.2c-3.6-2.2-7.8-3.7-12.6-3.7-6.2 0-9.9 3.2-9.9 7.6 0 5 4.1 7.2 11.5 10.4 11.6 4.9 16.8 10.5 16.8 20.3 0 11.2-8.9 19.3-24.3 19.3-7.7 0-14.7-2.3-19.8-5.9l5.7-10.2z"
    />
  </svg>
);

export const JavaScriptIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="128" height="128" rx="20" fill="#F7DF1E" />
    <path
      fill="#000000"
      d="M37.5 97.4c2.6 4.3 6.6 7.4 12.7 7.4 7 0 11.3-3.5 11.3-12.3V52.8H48.1v39.5c0 3.7-1.4 5.3-4.3 5.3-2.3 0-3.9-1.3-5-3.3l-1.3 3.1zm37.8-.3c3.7 5.2 9.5 8 16.6 8 12.4 0 19.8-7.3 19.8-17.7 0-10.5-6.7-15.1-16.3-19.2-6.5-2.8-9.4-5.2-9.4-9.5 0-3.9 3-6.8 8.1-6.8 4.6 0 7.7 1.9 9.9 5.3l10.1-6.2c-4.4-7-11.4-10.2-19.9-10.2-11.5 0-19.4 6.9-19.4 17.5 0 10.4 6.7 15.3 15.9 19.3 6.9 3 9.8 5.4 9.8 10 0 4.6-3.7 7.5-9.4 7.5-6.1 0-10.4-3.1-13.3-7.7l-12.4 7.7z"
    />
  </svg>
);

// ── Flutter Official Logo ─────────────────────────────────────────────
export const FlutterIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <g fill="#3FB6D3">
      <path d="M12.3 64.2L76.3 0h39.4L32.1 83.6zM76.3 128h39.4L81.6 93.9l34.1-34.8H76.3L42.2 93.5z" />
    </g>
    <path fill="#27AACD" d="M81.6 93.9l-20-20-19.4 19.6 19.4 19.6z" />
    <path fill="#19599A" d="M115.7 128L81.6 93.9l-20 19.2L76.3 128z" />
    <path fill="#195a9b" d="M61.6 113.1l30.8-8.4-10.8-10.8z" />
  </svg>
);

// ── Dart Official Logo ────────────────────────────────────────────────
export const DartIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path fill="#00c4b3" d="M35.2 34.9l-8.3-8.3v59.7l.1 2.8c0 1.3.2 2.8.7 4.3l65.6 23.1 16.3-7.2-74.4-74.4z" />
    <path fill="#22d3c5" d="M27.7 93.4zm81.9 15.9l-16.3 7.2-65.4-23.1c1.3 4.8 4 10.1 7 13.2l21.3 21.2 47.6.1 5.8-18.6z" />
    <path fill="#0075c9" d="M1.7 65.1C-.4 67.3.7 72 4 75.5l14.7 14.8 9.2 3.3c-.3-1.5-.7-3-.7-4.3l-.1-2.8-.2-59.8m82.7 82.6l7.2-16.4-23-65.6c-1.5-.3-3-.6-4.3-.7l-2.9-.1-59.6.1" />
    <path fill="#00a8e1" d="M109.6 109.3l17.7-5.8V54.8l-20.4-20.5c-3-3-8.3-5.8-13.2-7l23.1 65.6" />
    <path fill="#00c4b3" d="M90.5 18.2L75.7 3.5c-3.4-3.4-8-4.4-10.4-2.3L26.9 26.6h59.5l2.9.1c1.3 0 2.8.2 4.3.7l-3.1-9.2z" />
  </svg>
);

// ── MySQL Official Dolphin Logo (Sakila) ──────────────────────────────
export const MySQLIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="#00758F"
      d="M117.688 98.242c-6.973-.191-12.297.461-16.852 2.379-1.293.547-3.355.559-3.566 2.18.711.746.82 1.859 1.387 2.777 1.086 1.754 2.922 4.113 4.559 5.352 1.789 1.348 3.633 2.793 5.551 3.961 3.414 2.082 7.223 3.27 10.504 5.352 1.938 1.23 3.859 2.777 5.75 4.164.934.684 1.563 1.75 2.773 2.18v-.195c-.637-.812-.801-1.93-1.387-2.777l-2.578-2.578c-2.52-3.344-5.719-6.281-9.117-8.719-2.711-1.949-8.781-4.578-9.91-7.73l-.199-.199c1.922-.219 4.172-.914 5.949-1.391 2.98-.797 5.645-.59 8.719-1.387l4.164-1.187v-.793c-1.555-1.594-2.664-3.707-4.359-5.152-4.441-3.781-9.285-7.555-14.273-10.703-2.766-1.746-6.184-2.883-9.117-4.363-.988-.496-2.719-.758-3.371-1.586-1.539-1.961-2.379-4.449-3.566-6.738-2.488-4.793-4.93-10.023-7.137-15.066-1.504-3.437-2.484-6.828-4.359-9.91-9-14.797-18.687-23.73-33.695-32.508-3.195-1.867-7.039-2.605-11.102-3.57l-6.543-.395c-1.332-.555-2.715-2.184-3.965-2.977C16.977 3.52 4.223-3.312.539 5.672-1.785 11.34 4.016 16.871 6.09 19.746c1.457 2.012 3.32 4.273 4.359 6.539.688 1.492.805 2.984 1.391 4.559 1.438 3.883 2.695 8.109 4.559 11.695.941 1.816 1.98 3.727 3.172 5.352.727.996 1.98 1.438 2.18 2.973-1.227 1.715-1.297 4.375-1.984 6.543-3.098 9.77-1.926 21.91 2.578 29.137 1.383 2.223 4.641 6.98 9.117 5.156 3.918-1.598 3.043-6.539 4.164-10.902.254-.988.098-1.715.594-2.379v.199l3.57 7.133c2.641 4.254 7.324 8.699 11.297 11.699 2.059 1.555 3.68 4.242 6.344 5.152v-.199h-.199c-.516-.805-1.324-1.137-1.98-1.781-1.551-1.523-3.277-3.414-4.559-5.156-3.613-4.902-6.805-10.27-9.711-15.855-1.391-2.668-2.598-5.609-3.77-8.324-.453-1.047-.445-2.633-1.387-3.172-1.281 1.988-3.172 3.598-4.164 5.945-1.582 3.754-1.789 8.336-2.375 13.082-.348.125-.195.039-.398.199-2.762-.668-3.73-3.508-4.758-5.949-2.594-6.164-3.078-16.09-.793-23.191.59-1.836 3.262-7.617 2.18-9.316-.516-1.691-2.219-2.672-3.172-3.965-1.18-1.598-2.355-3.703-3.172-5.551-2.125-4.805-3.113-10.203-5.352-15.062-1.07-2.324-2.875-4.676-4.359-6.738-1.645-2.289-3.484-3.977-4.758-6.742-.453-.984-1.066-2.559-.398-3.566.215-.684.516-.969 1.191-1.191 1.148-.887 4.352.297 5.547.793 3.18 1.32 5.832 2.578 8.527 4.363 1.289.855 2.598 2.512 4.16 2.973h1.785c2.789.641 5.914.195 8.523.988 4.609 1.402 8.738 3.582 12.488 5.949 11.422 7.215 20.766 17.48 27.156 29.734 1.027 1.973 1.473 3.852 2.379 5.945 1.824 4.219 4.125 8.559 5.941 12.688 1.816 4.113 3.582 8.27 6.148 11.695 1.348 1.801 6.551 2.766 8.918 3.766 1.66.699 4.379 1.43 5.949 2.379 3 1.809 5.906 3.965 8.723 5.945 1.402.992 5.73 3.168 5.945 4.957zm-88.605-75.52c-1.453-.027-2.48.156-3.566.395v.199h.195c.695 1.422 1.918 2.34 2.777 3.566l1.98 4.164.199-.195c1.227-.867 1.789-2.25 1.781-4.363-.492-.52-.562-1.164-.992-1.785-.562-.824-1.66-1.289-2.375-1.98z"
    />
  </svg>
);

// ── Prisma Official Prism ─────────────────────────────────────────────
export const PrismaIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <path
      d="M19.1 18.2L12.9 2.5C12.7 2 12.2 1.7 11.6 1.9C11.3 2 11.1 2.2 11 2.5L2.8 17.5C2.5 18 2.6 18.6 3 19C3.2 19.2 3.5 19.3 3.8 19.3L17.8 21.8C18.4 21.9 18.9 21.5 19 21C19.1 20.8 19.1 20.6 19.1 20.4L19.1 18.2Z"
      fill="#2D3748"
      stroke="#5A67D8"
      strokeWidth="1.2"
    />
    <path
      d="M11.6 2.3L17.8 21.8L19.1 18.2L12.9 2.5C12.7 2 12.2 1.7 11.6 1.9Z"
      fill="#5A67D8"
    />
    <path
      d="M2.8 17.5L11.6 2.3L17.8 21.8L3.8 19.3C3.4 19.2 3.1 19 2.9 18.7L2.8 17.5Z"
      fill="#2D3748"
    />
  </svg>
);

// ── PostgreSQL Official Logo ──────────────────────────────────────────
export const PostgreSQLIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="#336791"
  >
    <path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698z" />
  </svg>
);

// ── GraphQL Official Pink Hexagon ─────────────────────────────────────
export const GraphQLIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="none"
      stroke="#E10098"
      strokeWidth="5"
      strokeLinejoin="round"
      d="M50 12 L83 31 L83 69 L50 88 L17 69 L17 31 Z"
    />
    <path
      fill="none"
      stroke="#E10098"
      strokeWidth="5"
      d="M50 12 L83 69 M83 31 L17 69 M17 31 L50 88 M50 12 L17 69 M83 31 L50 88 M83 69 L17 31"
    />
    <circle cx="50" cy="12" r="7" fill="#E10098" />
    <circle cx="83" cy="31" r="7" fill="#E10098" />
    <circle cx="83" cy="69" r="7" fill="#E10098" />
    <circle cx="50" cy="88" r="7" fill="#E10098" />
    <circle cx="17" cy="69" r="7" fill="#E10098" />
    <circle cx="17" cy="31" r="7" fill="#E10098" />
  </svg>
);

// ── Express.js ────────────────────────────────────────────────────────
export const ExpressIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="100" height="100" rx="20" fill="#18181B" stroke="#3F3F46" strokeWidth="3" />
    <text
      x="50"
      y="62"
      fill="#FFFFFF"
      fontSize="36"
      fontWeight="900"
      fontFamily="monospace"
      textAnchor="middle"
      letterSpacing="-2"
    >
      ex
    </text>
  </svg>
);

// ── REST APIs ─────────────────────────────────────────────────────────
export const RestApiIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
    stroke="#10B981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

// ── Docker Official Whale ─────────────────────────────────────────────
export const DockerIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="#2496ED"
      d="M123.6 57.5c-1.7-.9-10.7-5.5-22.3-1.6-1.5-6.9-6.3-11.2-6.5-11.4l-2.6-2-1.7 2.8c-3.7 6.1-4 13.3-1 19.3-3.7 2.1-9.9 4.3-17.6 4.3H4.4c-2.3 0-4.2 1.8-4.4 4.1-.9 11.4 2.3 22.8 9.3 32.1 9.3 12.3 24.2 19.6 40.8 19.9 33.1.6 62.3-16.7 75.3-43.5 10.9-.8 16.9-6.9 17.2-7.2l2.3-2.6-2.5-1.5c-4.4-2.8-13.8-8.2-18.8-10.7zM36.2 59.2h12v12h-12v-12zm-14.7 0h12v12h-12v-12zm29.4 0h12v12h-12v-12zm0-14.7h12v12h-12v-12zm-14.7 0h12v12h-12v-12zm-14.7 0h12v12h-12v-12zm29.4-14.7h12v12h-12v-12zm-14.7 0h12v12h-12v-12z"
    />
  </svg>
);

// ── Tailwind CSS Waves ────────────────────────────────────────────────
export const TailwindIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="#06B6D4"
      d="M64 25.6c-21.3 0-34.7 10.7-40 32 8-10.7 17.3-14.7 28-12 6.1 1.5 10.5 5.9 15.3 10.8 7.9 8 17 17.2 36.7 17.2 21.3 0 34.7-10.7 40-32-8 10.7-17.3 14.7-28 12-6.1-1.5-10.5-5.9-15.3-10.8-7.9-8-17-17.2-36.7-17.2zM24 68.3c-21.3 0-34.7 10.7-40 32 8-10.7 17.3-14.7 28-12 6.1 1.5 10.5 5.9 15.3 10.8 7.9 8 17 17.2 36.7 17.2 21.3 0 34.7-10.7 40-32-8 10.7-17.3 14.7-28 12-6.1-1.5-10.5-5.9-15.3-10.8-7.9-8-17-17.2-36.7-17.2z"
    />
  </svg>
);

// ── MongoDB Official Leaf ─────────────────────────────────────────────
export const MongoIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="#47A248"
      d="M64 3.2C63 4 41.5 25.5 41.5 64.3c0 28.5 16.9 44.2 21.5 47.9l1 1.8 1-1.8c4.6-3.7 21.5-19.4 21.5-47.9 0-38.8-21.5-60.3-22.5-61.1zm-1.5 105.7c-2.3-2.6-17-19.1-17-44.6 0-23.7 11.2-39.7 17-46.7v91.3zm3 0V17.6c5.8 7 17 23 17 46.7 0 25.5-14.7 42-17 44.6z"
    />
    <path
      fill="#3FA037"
      d="M64 124.8c-.8 0-1.5-.7-1.5-1.5v-10.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v10.5c0 .8-.7 1.5-1.5 1.5z"
    />
  </svg>
);

// ── Python Snakes ─────────────────────────────────────────────────────
export const PythonIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="#3776AB"
      d="M63.5 8c-28.7 0-27 12.4-27 12.4l.03 12.8h27.5v3.9H25.3S8 35.1 8 63.8c0 28.8 15.1 27.7 15.1 27.7h9V78.9s-.5-15.1 14.8-15.1h27.4s14.3.2 14.3-13.8V21.8S90.7 8 63.5 8zm-15 8.2a4.4 4.4 0 1 1 0 8.7 4.4 4.4 0 0 1 0-8.7z"
    />
    <path
      fill="#FFD43B"
      d="M64.5 120c28.7 0 27-12.4 27-12.4l-.03-12.8H64v-3.9h38.7s17.3 2 17.3-26.7c0-28.8-15.1-27.7-15.1-27.7h-9v12.6s.5 15.1-14.8 15.1H53.7s-14.3-.2-14.3 13.8v28.2S37.3 120 64.5 120zm15-8.2a4.4 4.4 0 1 1 0-8.7 4.4 4.4 0 0 1 0 8.7z"
    />
  </svg>
);

// ── Redis Layers ──────────────────────────────────────────────────────
export const RedisIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="#DC382D"
      d="M10.7 54.3L64 80.9l53.3-26.6-53.3-26.7-53.3 26.7zm0 24.4L64 105.3l53.3-26.6-13.3-6.7L64 92 24 72l-13.3 6.7z"
    />
  </svg>
);

// ── Git Official Logo ─────────────────────────────────────────────────
export const GitIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill="#F05032"
      d="M124.7 57.6L70.4 3.3c-4.4-4.4-11.5-4.4-15.9 0L3.3 54.5c-4.4 4.4-4.4 11.5 0 15.9l54.3 54.3c4.4 4.4 11.5 4.4 15.9 0l51.2-51.2c4.4-4.4 4.4-11.5 0-15.9z"
    />
    <path
      fill="#FFFFFF"
      d="M87.3 62.7c-2.4-1.4-5.3-1.6-7.8-.8L64.2 46.6c.5-1.5.4-3.1-.3-4.5-1.8-3.4-6-4.7-9.4-2.9-3.4 1.8-4.7 6-2.9 9.4 1.2 2.3 3.6 3.7 6.1 3.7.8 0 1.6-.2 2.4-.5l14.9 14.9c-.3.8-.5 1.6-.5 2.5 0 2.2.9 4.2 2.5 5.7L62.7 89.2c-.8-.3-1.6-.5-2.5-.5-3.8 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7c0-1.1-.3-2.1-.7-3l14.6-14.6c1 .5 2.1.8 3.3.8 3.8 0 7-3.1 7-7 0-3.9-3.2-7.2-7.1-7.2z"
    />
  </svg>
);

// ── Firebase Flame ────────────────────────────────────────────────────
export const FirebaseIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path fill="#FFA000" d="M17.5 103.3L33.2 2.5a2.9 2.9 0 0 1 5.4-.9l16.3 30.4 6.5-12.4a2.9 2.9 0 0 1 5.2 0l44 83.7H17.5z" />
    <path fill="#F57C00" d="M71.9 64L55 31.9 17.5 103.3z" />
    <path fill="#FFCA28" d="M110.6 103.3l-12.1-74.7a2.9 2.9 0 0 0-2-2.3 2.9 2.9 0 0 0-2.9.7L17.5 103.3l42.1 23.6a8.7 8.7 0 0 0 8.5 0l42.5-23.6z" />
  </svg>
);

// ── Vue.js ────────────────────────────────────────────────────────────
export const VueIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M26 9.4l23 .01L64 34.4 79 9.4h23L64.2 75.1z" fill="#35495E" />
    <path d="M.9 9.6l25.1-.2 38.2 65.7L102 9.4l25.1.03L64.1 117.5z" fill="#41B883" />
  </svg>
);

// ── Figma ─────────────────────────────────────────────────────────────
export const FigmaIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path fill="#0ACF83" d="M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129z" />
    <path fill="#A259FF" d="M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5z" />
    <path fill="#F24E1E" d="M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5z" />
    <path fill="#FF7262" d="M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67z" />
    <path fill="#1ABCFE" d="M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5z" />
  </svg>
);

// ── Kotlin ────────────────────────────────────────────────────────────
export const KotlinIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <defs>
      <linearGradient id="kotlin-grad" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E44857" />
        <stop offset="50%" stopColor="#C711E1" />
        <stop offset="100%" stopColor="#7F52FF" />
      </linearGradient>
    </defs>
    <path fill="url(#kotlin-grad)" d="M112.5 112.5H15.5V15.5h97L64 64z" />
  </svg>
);

// ── HTML5 Official Shield ─────────────────────────────────────────────
export const HtmlIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z" />
    <path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z" />
    <path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z" />
    <path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z" />
  </svg>
);

// ── CSS3 Official Shield ──────────────────────────────────────────────
export const CssIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z" />
    <path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z" />
    <path fill="#fff" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z" />
    <path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z" />
    <path fill="#fff" d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z" />
    <path fill="#EBEBEB" d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z" />
  </svg>
);

// ── Official Microsoft C# Logo (Authentic Purple Hexagon) ───────────
export const CSharpIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <path
      d="M115.4 30.7L66.7 2.6c-1.7-1-3.7-1-5.4 0L12.6 30.7c-1.7 1-2.7 2.7-2.7 4.7v57.2c0 1.9 1 3.7 2.7 4.7l48.7 28.1c1.7 1 3.7 1 5.4 0l48.7-28.1c1.7-1 2.7-2.7 2.7-4.7V35.4c0-2-1-3.7-2.7-4.7z"
      fill="#9B4993"
    />
    <path
      d="M109.8 33.9L65.4 8.3c-.9-.5-1.9-.5-2.8 0L18.2 33.9c-.9.5-1.4 1.4-1.4 2.5v55.2c0 1 .5 2 1.4 2.5l44.4 25.6c.9.5 1.9.5 2.8 0l44.4-25.6c.9-.5 1.4-1.4 1.4-2.5V36.4c0-1.1-.5-2-1.4-2.5z"
      fill="#68217A"
    />
    <path
      d="M62 42.5c-11.9 0-21.5 9.6-21.5 21.5s9.6 21.5 21.5 21.5c7.3 0 13.8-3.7 17.6-9.3l-8.5-4.9c-2.3 3.3-6.1 5.4-10.4 5.4-7 0-12.7-5.7-12.7-12.7s5.7-12.7 12.7-12.7c4.3 0 8.1 2.1 10.4 5.4l8.5-4.9c-3.8-5.6-10.3-9.3-17.6-9.3z"
      fill="#FFFFFF"
    />
    <path
      d="M86.2 57.5h-2.5l.7-4h-3.2l-.7 4h-3.2l.7-4h-3.2l-.7 4h-2.5v3.2h2.8l-.8 4.5h-2.8v3.2h2.3l-.7 4h3.2l.7-4h3.2l-.7 4h3.2l.7-4h2.5v-3.2h-2.8l.8-4.5h2.8v-3.2zm-6.2 7.7h-3.2l.8-4.5h3.2l-.8 4.5z"
      fill="#FFFFFF"
    />
  </svg>
);

// ── Official Microsoft .NET / ASP.NET Logo ───────────────────────────
export const AspNetIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <circle cx="64" cy="64" r="60" fill="#512BD4" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
    <circle cx="34" cy="78" r="5.5" fill="#FFFFFF" />
    <path d="M47 42h8l14 26V42h7v44h-7.5L54.5 61.5V86H47V42z" fill="#FFFFFF" />
    <path d="M83 42h16.5v6.5H89.5v12h9v6.5h-9v12.5H100V86H83V42z" fill="#FFFFFF" />
    <path d="M109 48.5h-7V42h21v6.5h-7V86h-7V48.5z" fill="#FFFFFF" />
  </svg>
);

// ── Official Java Coffee Cup Logo ────────────────────────────────────
export const JavaIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <path d="M48.2 92.4c-12.7 1.4-23.8-3.7-27.1-7.2 9.1-1.2 19.3.9 27.1 7.2z" fill="#5382A1"/>
    <path d="M43.7 75.3c-14.8 3.5-27.3-3.2-31.2-8.3 11.2-.8 23.4 2.8 31.2 8.3z" fill="#5382A1"/>
    <path d="M72.5 107.6c-21.2 4.4-44.1 2.3-56.3-5.2 7.8 2.2 21.8 3.8 38.4 1.1 14.2-2.3 26.2-7.8 35.7-14.3-4.2 8.1-10.4 14.8-17.8 18.4z" fill="#5382A1"/>
    <path d="M85.4 69.8c3.2-1.8 6.5-4.2 9.7-7.4 6.8-6.8 9.5-16.1 7.2-23.4-2.8-8.9-12.8-13.6-24.8-12.1 2.5 1.8 4.7 4 6.4 6.7 4.1 6.4 4.5 14.4.9 20.9-2.5 4.6-6.7 8.3-11.4 10.9 4.3 1.5 8.4 2.9 12 4.4z" fill="#EA2D2E"/>
    <path d="M60.1 53.6c4.6-5.4 6.8-12.4 5.7-18.7-.9-5.4-4.2-9.7-8.8-11.8 1.4 1.8 2.5 3.9 3 6.3 1.2 5.5-.3 11.4-3.8 15.9-3.2 4.2-7.9 7.1-13 8.7 5.7.5 11.9.1 16.9-.4z" fill="#EA2D2E"/>
    <path d="M41.8 116.8c18.5 1.2 38.6-1.5 53.9-9.1-13.5 4.3-32.9 6.2-53.9 9.1z" fill="#5382A1"/>
  </svg>
);

// ── Database Design (Relational Schema & Architecture) ─────────────────
export const DatabaseDesignIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <rect x="2.5" y="3" width="19" height="18" rx="3.5" stroke="#0284C7" strokeWidth="2" />
    <path d="M2.5 9h19" stroke="#0284C7" strokeWidth="2" />
    <path d="M9 9v12" stroke="#0284C7" strokeWidth="2" />
    <circle cx="5.5" cy="6" r="1.2" fill="#0284C7" />
    <circle cx="5.5" cy="13" r="1.2" fill="#38BDF8" />
    <circle cx="5.5" cy="17" r="1.2" fill="#38BDF8" />
    <path d="M12.5 13h5.5" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    <path d="M12.5 17h4" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── Data Structures & Algorithms (Binary Tree & Graph) ────────────────
export const DataStructuresIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <path d="M10 7.5L6.5 15" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 7.5L17.5 15" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="5" r="3.2" fill="#8B5CF6" />
    <circle cx="5.5" cy="17.5" r="3" fill="#38BDF8" />
    <circle cx="18.5" cy="17.5" r="3" fill="#38BDF8" />
  </svg>
);

// ── OOP (Object-Oriented Programming Architecture) ────────────────────
export const OopIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <path d="M12 2.5L3.5 7.4v9.2L12 21.5l8.5-4.9V7.4L12 2.5z" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 21.5v-9.5" stroke="#F59E0B" strokeWidth="2" />
    <path d="M20.5 7.4L12 12 3.5 7.4" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="12" cy="12" r="2.2" fill="#FBBF24" />
  </svg>
);

// ── Prompt Engineering & Generative AI ────────────────────────────────
export const PromptEngineeringIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <path
      d="M12 2L14.6 8.4L21 11L14.6 13.6L12 20L9.4 13.6L3 11L9.4 8.4L12 2Z"
      fill="url(#ai-grad-official)"
      stroke="#10B981"
      strokeWidth="1.5"
    />
    <circle cx="18.5" cy="5.5" r="1.5" fill="#38BDF8" />
    <circle cx="5.5" cy="18.5" r="1.2" fill="#34D399" />
    <defs>
      <linearGradient id="ai-grad-official" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
  </svg>
);

// ── SEO (Search Engine Optimization & Growth) ─────────────────────────
export const SeoIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
  >
    <circle cx="10.5" cy="10.5" r="7" stroke="#3B82F6" strokeWidth="2.2" />
    <path d="M19.5 19.5l-4-4" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M7.5 12l2.2-2.2 2 1.6 3-3.4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ReactNativeIcon = ReactIcon;

// ── Fallback Code Terminal Icon ───────────────────────────────────────
export const DefaultCodeIcon: React.FC<TechIconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    fill="none"
    stroke="#10B981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// ── Dynamic Brand Icon Resolver ──────────────────────────────────────
/**
 * Automatically maps any tech stack name (from CMS) to its authentic brand icon.
 * Normalizes input: handles spaces, dots, dashes, case-insensitive.
 */
export function getTechBrandIcon(techName: string, size: number = 20) {
  if (!techName) return <DefaultCodeIcon size={size} />;

  const clean = techName.toLowerCase().replace(/[\s\-_.]/g, '');

  // Exact & substring priority matching
  if (clean.includes('reactnative')) return <ReactNativeIcon size={size} />;
  if (clean.includes('flutter')) return <FlutterIcon size={size} />;
  if (clean.includes('dart')) return <DartIcon size={size} />;
  if (clean.includes('c#') || clean.includes('csharp')) return <CSharpIcon size={size} />;
  if (clean.includes('asp') || clean.includes('dotnet')) return <AspNetIcon size={size} />;
  if (clean.includes('java') && !clean.includes('javascript')) return <JavaIcon size={size} />;
  if (clean.includes('html')) return <HtmlIcon size={size} />;
  if (clean.includes('css') && !clean.includes('tailwind')) return <CssIcon size={size} />;
  if (clean.includes('mysql') || (clean.includes('sql') && !clean.includes('postgre'))) return <MySQLIcon size={size} />;
  if (clean.includes('postgres')) return <PostgreSQLIcon size={size} />;
  if (clean.includes('react')) return <ReactIcon size={size} />;
  if (clean.includes('node')) return <NodeIcon size={size} />;
  if (clean.includes('next')) return <NextIcon size={size} />;
  if (clean.includes('typescript') || clean === 'ts') return <TypeScriptIcon size={size} />;
  if (clean.includes('javascript') || clean === 'js') return <JavaScriptIcon size={size} />;
  if (clean.includes('firebase')) return <FirebaseIcon size={size} />;
  if (clean.includes('vue')) return <VueIcon size={size} />;
  if (clean.includes('figma')) return <FigmaIcon size={size} />;
  if (clean.includes('kotlin')) return <KotlinIcon size={size} />;
  if (clean.includes('prisma')) return <PrismaIcon size={size} />;
  if (clean.includes('graphql')) return <GraphQLIcon size={size} />;
  if (clean.includes('express')) return <ExpressIcon size={size} />;
  if (clean.includes('rest') || clean.includes('api')) return <RestApiIcon size={size} />;
  if (clean.includes('docker')) return <DockerIcon size={size} />;
  if (clean.includes('tailwind')) return <TailwindIcon size={size} />;
  if (clean.includes('mongo')) return <MongoIcon size={size} />;
  if (clean.includes('python')) return <PythonIcon size={size} />;
  if (clean.includes('redis')) return <RedisIcon size={size} />;
  if (clean.includes('git') || clean.includes('github')) return <GitIcon size={size} />;
  if (clean.includes('database') || clean.includes('dbdesign')) return <DatabaseDesignIcon size={size} />;
  if (clean.includes('datastructure') || clean.includes('algorithm') || clean.includes('algo')) return <DataStructuresIcon size={size} />;
  if (clean.includes('oop') || clean.includes('objectoriented')) return <OopIcon size={size} />;
  if (clean.includes('prompt') || clean.includes('ai') || clean.includes('gpt')) return <PromptEngineeringIcon size={size} />;
  if (clean.includes('seo')) return <SeoIcon size={size} />;

  return <DefaultCodeIcon size={size} />;
}
