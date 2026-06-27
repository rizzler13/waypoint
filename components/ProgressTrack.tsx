'use client';

import React from 'react';
import { Step } from '@/types';

interface ProgressTrackProps {
  steps: Step[];
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
}

export default function ProgressTrack({
  steps,
  currentStepIndex,
  onStepSelect
}: ProgressTrackProps) {
  return (
    <div className="w-8 flex flex-col items-center py-6 border-r border-gray-100 bg-gray-50 h-full relative select-none">
      {/* Vertical Progress Line */}
      <div className="absolute w-[2px] bg-gray-200 top-8 bottom-8 left-1/2 -translate-x-1/2 z-0"></div>

      {/* Progress Dots */}
      <div className="flex flex-col justify-between items-center h-full z-10 w-full px-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => onStepSelect(idx)}
              className="group relative flex items-center justify-center w-6 h-6 focus:outline-none"
              title={step.title || `Step ${idx + 1}`}
            >
              {/* Dot Shape */}
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center
                  ${isActive
                    ? 'bg-[#1B17FE] border-[#1B17FE] scale-125 shadow-md shadow-blue-200'
                    : isCompleted
                      ? 'bg-white border-blue-400 group-hover:bg-blue-50'
                      : 'bg-white border-gray-300 group-hover:border-gray-400'}`}
              >
                {/* Active Inner dot */}
                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>

              {/* Pulsing ring for active dot */}
              {isActive && (
                <div className="absolute w-6 h-6 bg-[#1B17FE] opacity-20 rounded-full animate-ping pointer-events-none"></div>
              )}

              {/* Tooltip on hover */}
              <div className="absolute left-8 bg-gray-900 text-white text-[9px] font-sans font-semibold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-50">
                {step.title || `Step ${idx + 1}`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
