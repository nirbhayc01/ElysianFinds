/* ============================================================
   ELYSIAN FINDS — Placeholder jewelry line-art icon library
   Each function returns an SVG string. Swap product.icon photos
   for real photography when available; markup is only a stand-in.
   ============================================================ */

const ICONS = {

  ring_round: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="128" r="52" stroke="#C9A96A" stroke-width="3"/>
    <path d="M100 76 L82 48 L118 48 Z" fill="#C9A96A" opacity="0.9"/>
    <circle cx="100" cy="58" r="13" fill="#6E2A3A" stroke="#C9A96A" stroke-width="2"/>
  </svg>`,

  ring_oval: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="130" r="50" stroke="#C9A96A" stroke-width="3"/>
    <ellipse cx="100" cy="62" rx="17" ry="24" fill="#F6F1E7" stroke="#C9A96A" stroke-width="2.5"/>
    <path d="M84 66 L100 40 L116 66" stroke="#C9A96A" stroke-width="2"/>
  </svg>`,

  necklace_pendant: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 30 C30 110 80 130 100 130 C120 130 170 110 170 30" stroke="#C9A96A" stroke-width="2.5"/>
    <path d="M85 128 L100 165 L115 128 Z" fill="#6E2A3A" stroke="#C9A96A" stroke-width="2"/>
    <circle cx="100" cy="122" r="7" fill="#C9A96A"/>
  </svg>`,

  necklace_layered: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M34 26 C34 92 78 110 100 110 C122 110 166 92 166 26" stroke="#C9A96A" stroke-width="2"/>
    <path d="M46 26 C46 118 82 145 100 145 C118 145 154 118 154 26" stroke="#9C7A3C" stroke-width="2"/>
    <circle cx="100" cy="145" r="8" fill="#F6F1E7" stroke="#C9A96A" stroke-width="2"/>
  </svg>`,

  earring_drop: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="50" r="9" stroke="#C9A96A" stroke-width="2.5"/>
    <path d="M70 59 L70 90" stroke="#C9A96A" stroke-width="2"/>
    <path d="M55 90 Q70 145 85 90 Z" fill="#6E2A3A" stroke="#C9A96A" stroke-width="2"/>
    <circle cx="130" cy="50" r="9" stroke="#C9A96A" stroke-width="2.5"/>
    <path d="M130 59 L130 90" stroke="#C9A96A" stroke-width="2"/>
    <path d="M115 90 Q130 145 145 90 Z" fill="#6E2A3A" stroke="#C9A96A" stroke-width="2"/>
  </svg>`,

  earring_stud: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="75" cy="90" r="18" fill="#F6F1E7" stroke="#C9A96A" stroke-width="2.5"/>
    <circle cx="125" cy="90" r="18" fill="#F6F1E7" stroke="#C9A96A" stroke-width="2.5"/>
    <path d="M75 108 L75 118" stroke="#C9A96A" stroke-width="2"/>
    <path d="M125 108 L125 118" stroke="#C9A96A" stroke-width="2"/>
  </svg>`,

  bangle_single: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="66" stroke="#C9A96A" stroke-width="8"/>
    <circle cx="100" cy="100" r="66" stroke="#9C7A3C" stroke-width="2" stroke-dasharray="4 6"/>
  </svg>`,

  bangle_stack: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="90" r="60" stroke="#C9A96A" stroke-width="6"/>
    <circle cx="100" cy="112" r="60" stroke="#9C7A3C" stroke-width="6"/>
    <circle cx="100" cy="134" r="60" stroke="#6E2A3A" stroke-width="6"/>
  </svg>`,

  pendant_set: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 30 C40 96 80 116 100 116 C120 116 160 96 160 30" stroke="#C9A96A" stroke-width="2.5"/>
    <path d="M80 114 L100 160 L120 114 Z" fill="#6E2A3A" stroke="#C9A96A" stroke-width="2"/>
    <circle cx="42" cy="46" r="8" stroke="#C9A96A" stroke-width="2"/>
    <path d="M42 54 L42 72" stroke="#C9A96A" stroke-width="1.6"/>
    <circle cx="158" cy="46" r="8" stroke="#C9A96A" stroke-width="2"/>
    <path d="M158 54 L158 72" stroke="#C9A96A" stroke-width="1.6"/>
  </svg>`,

  mangalsutra: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 24 C32 100 80 128 100 128 C120 128 168 100 168 24" stroke="#0F1D18" stroke-width="8"/>
    <path d="M32 24 C32 100 80 128 100 128 C120 128 168 100 168 24" stroke="#C9A96A" stroke-width="2"/>
    <path d="M84 126 L100 162 L116 126 Z" fill="#9C7A3C" stroke="#C9A96A" stroke-width="2"/>
  </svg>`,

  brooch: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="46" stroke="#C9A96A" stroke-width="3"/>
    <circle cx="100" cy="100" r="10" fill="#6E2A3A" stroke="#C9A96A" stroke-width="2"/>
    <path d="M100 54 L100 70 M100 130 L100 146 M54 100 L70 100 M130 100 L146 100 M67 67 L79 79 M121 121 L133 133 M133 67 L121 79 M79 121 L67 133" stroke="#C9A96A" stroke-width="2"/>
  </svg>`,

  anklet: () => `
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 100 Q100 150 170 100" stroke="#C9A96A" stroke-width="3"/>
    <circle cx="50" cy="112" r="4" fill="#C9A96A"/>
    <circle cx="75" cy="128" r="4" fill="#C9A96A"/>
    <circle cx="100" cy="134" r="4" fill="#C9A96A"/>
    <circle cx="125" cy="128" r="4" fill="#C9A96A"/>
    <circle cx="150" cy="112" r="4" fill="#C9A96A"/>
  </svg>`,
};

const ICON_KEYS = Object.keys(ICONS);

/* ============================================================
   ELYSIAN FINDS — Category glyphs
   Small, single-stroke, monochrome icons designed to sit inside a
   circular badge at ~24px. Kept deliberately simpler than the
   ICONS above, which are ornate placeholder "product art" meant
   for large dark boxes — those read poorly at small sizes on a
   light background, which is what these replace on the homepage.
   ============================================================ */
const CATEGORY_GLYPHS = {

  Rings: () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="15" r="5.5"/>
    <path d="M8.5 9 L12 3 L15.5 9"/>
  </svg>`,

  Necklaces: () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4c0 7.5 4.8 10.5 8 10.5s8-3 8-10.5"/>
    <path d="M10 14l2 5 2-5"/>
  </svg>`,

  Earrings: () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6" r="1.8"/>
    <path d="M12 7.8v2.4"/>
    <path d="M9 10.2c0 4.6 1.8 8.3 3 8.3s3-3.7 3-8.3"/>
  </svg>`,

  Bangles: () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8"/>
  </svg>`,

  Mangalsutra: () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5c0 7 4.8 9.5 8 9.5s8-2.5 8-9.5" stroke-dasharray="0.1 3.2"/>
    <path d="M9.5 13.2 L12 19 L14.5 13.2 Z"/>
  </svg>`,

  Accessories: () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>
  </svg>`,

  default: () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>
  </svg>`,
};