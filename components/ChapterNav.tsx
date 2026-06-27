'use client';

import React from 'react';

interface ChapterNavProps {
  currentChapterTitle: string;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function ChapterNav({
  currentChapterTitle,
  onPrevChapter,
  onNextChapter,
  hasPrev,
  hasNext
}: ChapterNavProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3 select-none">
      {/* Previous Button */}
      <button
        onClick={onPrevChapter}
        disabled={!hasPrev}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-all font-sans text-lg
          ${hasPrev ? 'text-gray-700 hover:bg-gray-50 active:scale-95' : 'text-gray-300 cursor-not-allowed opacity-50'}`}
        title="Previous Chapter"
      >
        &lsaquo;
      </button>

      {/* Chapter Label */}
      <div className="text-center font-sans">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">
          Current Chapter
        </span>
        <span className="text-sm font-bold text-gray-800">
          {currentChapterTitle}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={onNextChapter}
        disabled={!hasNext}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-all font-sans text-lg
          ${hasNext ? 'text-gray-700 hover:bg-gray-50 active:scale-95' : 'text-gray-300 cursor-not-allowed opacity-50'}`}
        title="Next Chapter"
      >
        &rsaquo;
      </button>
    </div>
  );
}
