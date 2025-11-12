const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const publicDir = path.join(__dirname, '..', 'public');

// Create a simple icon with SVG
const createIcon = async (size) => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#4A90E2" rx="${size / 6}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="none" stroke="white" stroke-width="${size / 16}"/>
      <path d="M ${size / 2} ${size / 4} L ${size / 2} ${size / 2} L ${size * 0.65} ${size * 0.65}" 
            stroke="white" stroke-width="${size / 16}" stroke-linecap="round" fill="none"/>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(publicDir, `icon${size}.png`));
  
  console.log(`Generated icon${size}.png`);
};

(async () => {
  for (const size of sizes) {
    await createIcon(size);
  }
})();
