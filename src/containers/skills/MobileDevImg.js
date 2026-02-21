import React from "react";

export default function MobileFinanceIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 580 520"
      width="580"
      height="520"
      aria-label="Mobile finance analytics illustration"
    >
      <defs>
        {/* Phone screen gradient */}
        <linearGradient id="phoneBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f7ff" />
          <stop offset="100%" stopColor="#eef0fa" />
        </linearGradient>

        {/* Donut chart arc helper - blue */}
        <linearGradient id="blueArc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>

        {/* Gear gradient */}
        <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>

        {/* Gold coin gradient */}
        <radialGradient id="coinGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#F9A825" />
        </radialGradient>

        {/* Speech bubble shadow */}
        <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#00000018" />
        </filter>

        <filter id="softShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#00000015" />
        </filter>

        {/* Clip phone screen */}
        <clipPath id="screenClip">
          <rect x="95" y="62" width="272" height="396" rx="6" />
        </clipPath>
      </defs>

      {/* ── GEAR (left) ── */}
      <g transform="translate(30, 230)">
        {/* Gear teeth via polygon approximation */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          const x = Math.cos(angle) * 62;
          const y = Math.sin(angle) * 62;
          return (
            <rect
              key={i}
              x={x - 7}
              y={y - 7}
              width="14"
              height="14"
              rx="3"
              fill="url(#gearGrad)"
              transform={`rotate(${i * 36}, ${x}, ${y})`}
            />
          );
        })}
        <circle cx="0" cy="0" r="56" fill="url(#gearGrad)" />
        <circle cx="0" cy="0" r="36" fill="white" />
        {/* Dollar coin in gear */}
        <circle cx="0" cy="0" r="26" fill="url(#coinGrad)" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#E65100"
          fontFamily="Georgia, serif"
        >
          $
        </text>
      </g>

      {/* ── PHONE BODY ── */}
      <g filter="url(#dropShadow)">
        <rect x="80" y="30" width="302" height="456" rx="36" fill="#1a1a2e" />
        <rect
          x="88"
          y="38"
          width="286"
          height="440"
          rx="30"
          fill="url(#phoneBodyGrad)"
        />
      </g>

      {/* Notch */}
      <rect x="188" y="38" width="86" height="14" rx="7" fill="#1a1a2e" />

      {/* ── SCREEN CONTENT ── */}
      <g clipPath="url(#screenClip)">
        {/* Top profile row */}
        {/* Avatar circle */}
        <circle cx="130" cy="98" r="22" fill="#FFCCBC" />
        <circle cx="130" cy="90" r="10" fill="#FF7043" />
        <ellipse cx="130" cy="110" rx="14" ry="10" fill="#FF7043" />
        {/* red icon bg */}
        <circle
          cx="130"
          cy="98"
          r="22"
          fill="none"
          stroke="#FF7043"
          strokeWidth="2"
        />

        {/* Text lines next to avatar */}
        <rect x="162" y="88" width="90" height="8" rx="4" fill="#CBD5E1" />
        <rect x="162" y="102" width="60" height="6" rx="3" fill="#E2E8F0" />

        {/* Divider */}
        <line
          x1="95"
          y1="132"
          x2="355"
          y2="132"
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {/* ── DONUT CHART ── */}
        {/* Blue large arc ~60% */}
        <path d="M 185 245 L 185 175 A 70 70 0 1 1 118 210 Z" fill="#1565C0" />
        {/* Red arc ~20% */}
        <path d="M 185 245 L 118 210 A 70 70 0 0 1 148 162 Z" fill="#E53935" />
        {/* Yellow arc ~12% */}
        <path d="M 185 245 L 148 162 A 70 70 0 0 1 185 175 Z" fill="#FDD835" />
        {/* Gray arc small */}
        <path d="M 185 245 L 255 245 A 70 70 0 0 0 255 244 Z" fill="#B0BEC5" />
        {/* Donut hole */}
        <circle cx="185" cy="245" r="38" fill="white" />
        {/* Coin in hole */}
        <circle cx="185" cy="245" r="28" fill="url(#coinGrad)" />
        <text
          x="185"
          y="252"
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="#E65100"
          fontFamily="Georgia, serif"
        >
          $
        </text>

        {/* ── BAR CHART ── */}
        {/* Yellow bar */}
        <rect x="108" y="340" width="22" height="40" rx="4" fill="#FDD835" />
        {/* Red bar (tallest) */}
        <rect x="138" y="310" width="22" height="70" rx="4" fill="#E53935" />
        {/* Blue bar */}
        <rect x="168" y="320" width="22" height="60" rx="4" fill="#1565C0" />

        {/* Text line placeholders right of chart */}
        <rect x="210" y="316" width="90" height="8" rx="4" fill="#CBD5E1" />
        <rect x="210" y="330" width="60" height="6" rx="3" fill="#E2E8F0" />
        <rect x="210" y="348" width="90" height="8" rx="4" fill="#CBD5E1" />
        <rect x="210" y="362" width="70" height="6" rx="3" fill="#E2E8F0" />

        {/* Chart baseline */}
        <line
          x1="100"
          y1="382"
          x2="320"
          y2="382"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        {/* Horizontal label lines top section */}
        <rect x="200" y="148" width="120" height="7" rx="3.5" fill="#CBD5E1" />
        <rect x="200" y="162" width="90" height="6" rx="3" fill="#E2E8F0" />
        <rect x="200" y="175" width="100" height="6" rx="3" fill="#E2E8F0" />
        <rect x="200" y="188" width="70" height="6" rx="3" fill="#E2E8F0" />
      </g>

      {/* Phone side buttons */}
      <rect x="382" y="130" width="5" height="44" rx="2.5" fill="#333" />
      <rect x="75" y="120" width="5" height="30" rx="2.5" fill="#333" />
      <rect x="75" y="158" width="5" height="50" rx="2.5" fill="#333" />

      {/* ── SPEECH BUBBLE (% sign) ── */}
      <g filter="url(#softShadow)">
        <circle cx="348" cy="52" r="36" fill="white" />
        <polygon points="330,80 340,95 356,80" fill="white" />
        <text
          x="348"
          y="62"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill="#1a237e"
          fontFamily="Georgia, serif"
        >
          %
        </text>
      </g>

      {/* ── PERSON ── */}
      {/* Shadow */}
      <ellipse cx="480" cy="492" rx="58" ry="10" fill="#00000012" />

      {/* Legs */}
      {/* Left leg */}
      <rect
        x="450"
        y="390"
        width="30"
        height="90"
        rx="14"
        fill="#1a1a2e"
        transform="rotate(-8, 465, 435)"
      />
      {/* Right leg */}
      <rect
        x="482"
        y="390"
        width="30"
        height="85"
        rx="14"
        fill="#1a1a2e"
        transform="rotate(5, 497, 432)"
      />

      {/* Shoes */}
      <ellipse
        cx="452"
        cy="476"
        rx="24"
        ry="11"
        fill="#111"
        transform="rotate(-8, 452, 476)"
      />
      <ellipse
        cx="500"
        cy="472"
        rx="22"
        ry="10"
        fill="#111"
        transform="rotate(4, 500, 472)"
      />
      {/* Shoe highlight */}
      <ellipse
        cx="445"
        cy="472"
        rx="10"
        ry="4"
        fill="#444"
        opacity="0.6"
        transform="rotate(-8, 445, 472)"
      />

      {/* Body / torso - blue sweater */}
      <rect x="430" y="280" width="100" height="120" rx="30" fill="#1565C0" />

      {/* Left arm (pointing at phone) */}
      <rect
        x="340"
        y="268"
        width="100"
        height="32"
        rx="16"
        fill="#1565C0"
        transform="rotate(-18, 390, 284)"
      />
      {/* Left hand */}
      <circle cx="350" cy="258" r="14" fill="#FFCCBC" />
      {/* Pointing finger */}
      <rect x="338" y="244" width="10" height="22" rx="5" fill="#FFCCBC" />

      {/* Right arm (holding tablet) */}
      <rect
        x="518"
        y="300"
        width="36"
        height="90"
        rx="16"
        fill="#1565C0"
        transform="rotate(12, 536, 345)"
      />

      {/* Tablet in right hand */}
      <rect
        x="525"
        y="310"
        width="50"
        height="70"
        rx="6"
        fill="#e8eaf6"
        stroke="#9fa8da"
        strokeWidth="2"
        transform="rotate(8, 550, 345)"
      />
      <rect
        x="530"
        y="316"
        width="40"
        height="52"
        rx="4"
        fill="white"
        transform="rotate(8, 550, 342)"
      />

      {/* Neck */}
      <rect x="464" y="264" width="30" height="28" rx="12" fill="#FFCCBC" />

      {/* Head */}
      <circle cx="480" cy="240" r="40" fill="#FFCCBC" />

      {/* Hair */}
      <ellipse cx="480" cy="208" rx="36" ry="14" fill="#1a1a2e" />
      <rect x="444" y="208" width="72" height="20" rx="0" fill="#1a1a2e" />
      {/* Hair sides */}
      <ellipse cx="446" cy="224" rx="10" ry="18" fill="#1a1a2e" />
      <ellipse cx="516" cy="220" rx="8" ry="14" fill="#1a1a2e" />

      {/* Ear */}
      <ellipse cx="440" cy="242" rx="8" ry="10" fill="#FFCCBC" />
      <ellipse cx="521" cy="242" rx="7" ry="9" fill="#FFCCBC" />

      {/* Eyes */}
      <ellipse cx="467" cy="240" rx="5" ry="6" fill="#1a1a2e" />
      <ellipse cx="493" cy="240" rx="5" ry="6" fill="#1a1a2e" />
      {/* Eye shine */}
      <circle cx="469" cy="238" r="1.5" fill="white" />
      <circle cx="495" cy="238" r="1.5" fill="white" />

      {/* Eyebrows */}
      <path
        d="M 461 230 Q 467 226 473 230"
        stroke="#1a1a2e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 487 230 Q 493 226 499 230"
        stroke="#1a1a2e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Nose */}
      <path
        d="M 480 248 Q 476 256 480 258 Q 484 256 480 248"
        stroke="#d4a08a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Mouth - slight smile */}
      <path
        d="M 471 268 Q 480 274 489 268"
        stroke="#c47a5a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Collar */}
      <path
        d="M 460 278 L 470 292 L 480 286 L 490 292 L 500 278"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}
