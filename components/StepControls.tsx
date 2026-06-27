'use client';

import React from 'react';

interface StepControlsProps {
  onContinue: () => void;
  onSkip: () => void;
  continueLabel?: string;
  showSkip?: boolean;
}

export default function StepControls({
  onContinue,
  onSkip,
  continueLabel = 'Continue',
  showSkip = true
}: StepControlsProps) {
  return (
    <div className="border-t border-gray-200 bg-white p-4 select-none">
      <div className="flex gap-3">
        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="flex-1 py-3 px-6 text-sm font-semibold rounded-lg bg-[#1B17FE] hover:brightness-110 text-white shadow-sm active:scale-[0.98] transition-all cursor-pointer text-center font-sans"
        >
          {continueLabel}
        </button>

        {/* Skip Button */}
        {showSkip && (
          <button
            onClick={onSkip}
            className="py-3 px-5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer font-sans"
          >
            Skip
          </button>
        )}
      </div>
      <div className="text-center mt-2.5">
        <span className="text-[10px] text-gray-400 font-sans">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] font-mono font-bold text-gray-600">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] font-mono font-bold text-gray-600">&rarr;</kbd> to continue
        </span>
      </div>
    </div>
  );
}
