'use client';

import React, { useRef, useEffect } from 'react';

interface ResizerProps {
  onResize: (newWidth: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export default function Resizer({ onResize, minWidth = 300, maxWidth = 800 }: ResizerProps) {
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize, minWidth, maxWidth]);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // prevent text selection during drag
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className="w-1.5 h-full cursor-col-resize hover:bg-[#1B17FE] bg-gray-200 border-l border-r border-gray-300 transition-colors flex items-center justify-center relative select-none"
      title="Drag to resize panel"
    >
      {/* Decorative vertical drag lines */}
      <div className="w-0.5 h-6 bg-gray-400 rounded-full"></div>
    </div>
  );
}
