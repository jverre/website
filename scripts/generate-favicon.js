const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 32x32 canvas
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 32, 32);

// Add text
ctx.fillStyle = 'white';
ctx.font = 'bold 16px system-ui';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('JV', 16, 16);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/favicon.ico', buffer); 