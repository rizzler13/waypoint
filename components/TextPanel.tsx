'use client';

import React from 'react';
import { Chapter } from '@/types';
import ChapterNav from './ChapterNav';
import ProgressTrack from './ProgressTrack';
import StepControls from './StepControls';

interface TextPanelProps {
  currentChapter: Chapter;
  currentStepIndex: number;
  onStepSelect: (idx: number) => void;
  onContinue: () => void;
  onSkip: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  hasPrevChapter: boolean;
  hasNextChapter: boolean;
  continueLabel: string;
}

export default function TextPanel({
  currentChapter,
  currentStepIndex,
  onStepSelect,
  onContinue,
  onSkip,
  onPrevChapter,
  onNextChapter,
  hasPrevChapter,
  hasNextChapter,
  continueLabel
}: TextPanelProps) {
  const currentStep = currentChapter.steps[currentStepIndex];

  return (
    <div className="flex flex-col h-full bg-white select-text w-full">
      {/* Chapter Top Navigation */}
      <ChapterNav
        currentChapterTitle={currentChapter.title}
        onPrevChapter={onPrevChapter}
        onNextChapter={onNextChapter}
        hasPrev={hasPrevChapter}
        hasNext={hasNextChapter}
      />

      {/* Main Content Area split into Track and Prose */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Vertical Progress Dots on the far left */}
        <ProgressTrack
          steps={currentChapter.steps}
          currentStepIndex={currentStepIndex}
          onStepSelect={onStepSelect}
        />

        {/* Scrollable Prose Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 font-serif prose prose-slate max-w-none">
          {/* Step Header */}
          {currentStep?.title && (
            <h2 className="text-xl font-bold text-gray-900 font-display tracking-tight mb-4 leading-snug">
              {currentStep.title}
            </h2>
          )}

          {/* Step Body HTML Content */}
          <div
            className="text-gray-700 leading-relaxed text-sm space-y-4 font-serif"
            dangerouslySetInnerHTML={{ __html: currentStep?.text || '' }}
          />

          {/* Step Progress Bar between content and controls */}
          <div className="mt-8 flex items-center justify-between text-[10px] text-gray-400 font-sans uppercase tracking-wider font-semibold border-t border-gray-100 pt-4">
            <span>Progress in Chapter</span>
            <span>
              {currentStepIndex + 1} of {currentChapter.steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#1B17FE] h-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / currentChapter.steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom Step Actions */}
      <StepControls
        onContinue={onContinue}
        onSkip={onSkip}
        continueLabel={continueLabel}
        showSkip={currentStepIndex < currentChapter.steps.length - 1}
      />
    </div>
  );
}
