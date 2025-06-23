// src/app/api/placeholder/[width]/[height]/route.js
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { width, height } = params;

  // Artist-themed placeholder SVG
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)" />
      
      <!-- Artist Icon -->
      <circle cx="50%" cy="35%" r="25" fill="#cbd5e1" opacity="0.7"/>
      <circle cx="50%" cy="32%" r="12" fill="#94a3b8"/>
      <ellipse cx="50%" cy="50%" rx="20" ry="12" fill="#94a3b8"/>
      
      <!-- Microphone Icon -->
      <circle cx="${width * 0.7}" cy="${
    height * 0.3
  }" r="8" fill="#8b5cf6" opacity="0.6"/>
      <rect x="${width * 0.7 - 1}" y="${
    height * 0.3 + 8
  }" width="2" height="15" fill="#8b5cf6" opacity="0.6"/>
      
      <!-- Music Notes -->
      <circle cx="${width * 0.25}" cy="${
    height * 0.25
  }" r="3" fill="#f59e0b" opacity="0.7"/>
      <path d="M${width * 0.25} ${height * 0.25} Q${width * 0.3} ${
    height * 0.2
  } ${width * 0.32} ${
    height * 0.28
  }" stroke="#f59e0b" stroke-width="2" fill="none" opacity="0.7"/>
      
      <!-- Text -->
      <text x="50%" y="75%" font-family="system-ui, -apple-system, sans-serif" 
            font-size="14" font-weight="500" text-anchor="middle" fill="#64748b">
        Artist Photo
      </text>
      <text x="50%" y="85%" font-family="system-ui, -apple-system, sans-serif" 
            font-size="11" text-anchor="middle" fill="#94a3b8">
        ${width} × ${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
