// Script to generate PNG icons from SVG
// Run: node scripts/generate-icons.js

import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

const sizes = [16, 32, 48, 128];

sizes.forEach((size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#8b5cf6");
  gradient.addColorStop(1, "#6d28d9");

  // Draw rounded rectangle
  const radius = size * 0.1875;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw moon circle
  const centerX = size / 2;
  const centerY = size / 2;
  const moonRadius = size * 0.25;

  ctx.beginPath();
  ctx.arc(centerX, centerY, moonRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = size * 0.0625;
  ctx.stroke();

  // Draw half moon fill
  ctx.beginPath();
  ctx.arc(centerX, centerY, moonRadius, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(centerX, centerY - moonRadius);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Save PNG
  const buffer = canvas.toBuffer("image/png");
  const outputPath = path.join("public", "icons", `icon${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated ${outputPath}`);
});

console.log("All icons generated!");
