'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = '', iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <Link href="/" className={`flex items-center no-underline select-none ${className}`}>
        <div className="w-12 h-12 overflow-hidden flex items-center justify-start">
          <img
            src="/waypoint-logo.svg"
            className="h-12 max-w-none object-contain"
            style={{ 
              objectPosition: 'left center',
              width: 'auto'
            }}
            alt="Waypoint Icon"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center no-underline select-none ${className}`}>
      <img
        src="/waypoint-logo.svg"
        className="h-8 w-auto object-contain block hover:opacity-95 transition-opacity"
        alt="Waypoint Logo"
      />
    </Link>
  );
}
