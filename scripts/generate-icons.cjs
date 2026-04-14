const sharp = require("sharp");

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  for (const size of sizes) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6"/>
          <stop offset="100%" style="stop-color:#6d28d9"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${
      size * 0.15
    }" fill="url(#grad)"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${
      size * 0.25
    }" fill="none" stroke="#fff" stroke-width="${Math.max(1, size * 0.05)}"/>
      <path d="M${size / 2} ${size / 4} C${size * 0.35} ${size / 4}, ${
      size / 4
    } ${size * 0.35}, ${size / 4} ${size / 2} C${size / 4} ${size * 0.65}, ${
      size * 0.35
    } ${size * 0.75}, ${size / 2} ${size * 0.75} Z" fill="#fff"/>
    </svg>`;

    await sharp(Buffer.from(svg)).png().toFile(`public/icons/icon${size}.png`);
    console.log(`Generated icon${size}.png`);
  }
  console.log("All icons generated!");
}

generateIcons().catch(console.error);
