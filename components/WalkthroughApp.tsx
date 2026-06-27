'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getChapters, getNextChapter, getPrevChapter } from '@/lib/chapters';
import TextPanel from './TextPanel';
import CanvasView from './CanvasView';
import Resizer from './Resizer';

import Header from './Header';

export default function WalkthroughApp() {
  const chapters = getChapters();

  // Walkthrough State
  const [currentChapterId, setCurrentChapterId] = useState('iam');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(420);
  const [isCompleted, setIsCompleted] = useState(false);

  // Set initial chapter from URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ch = params.get('chapter');
      if (ch && ['iam', 'vpc', 'ec2', 's3', 'cloudfront'].includes(ch)) {
        setCurrentChapterId(ch);
        setCurrentStepIndex(0);
        setIsCompleted(false);
      }
    }
  }, []);

  // Update completed chapters tracker in localStorage
  useEffect(() => {
    const chapterIds = chapters.map(c => c.id);
    const currentIdx = chapterIds.indexOf(currentChapterId);
    let completed: string[] = [];
    if (isCompleted) {
      completed = chapterIds;
    } else if (currentIdx > 0) {
      completed = chapterIds.slice(0, currentIdx);
    }
    localStorage.setItem('wp_completed_chapters', JSON.stringify(completed));
    window.dispatchEvent(new Event('wp_progress_update'));
  }, [currentChapterId, isCompleted, chapters]);

  const currentChapter = chapters.find(c => c.id === currentChapterId) || chapters[0];
  const steps = currentChapter.steps;
  const currentStep = steps[currentStepIndex];

  const handleStepSelect = (idx: number) => {
    setCurrentStepIndex(idx);
    setIsCompleted(false);
  };

  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const handleContinue = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      const nextCh = getNextChapter(currentChapterId);
      if (nextCh) {
        setCurrentChapterId(nextCh.id);
        setCurrentStepIndex(0);
      } else {
        // All chapters finished!
        setIsCompleted(true);
      }
    }
  }, [currentStepIndex, steps.length, currentChapterId]);

  const handleSkip = () => {
    setCurrentStepIndex(steps.length - 1);
  };

  const handlePrevChapter = () => {
    const prevCh = getPrevChapter(currentChapterId);
    if (prevCh) {
      setCurrentChapterId(prevCh.id);
      setCurrentStepIndex(0);
      setIsCompleted(false);
    }
  };

  const handleNextChapter = () => {
    const nextCh = getNextChapter(currentChapterId);
    if (nextCh) {
      setCurrentChapterId(nextCh.id);
      setCurrentStepIndex(0);
      setIsCompleted(false);
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is focusing on an interactive form element
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'BUTTON')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault(); // stop page scrolling
        handleContinue();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleContinue();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleContinue, handlePrevStep]);

  const handleRestart = () => {
    setCurrentChapterId(chapters[0].id);
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  // Calculate continue button label
  const isLastStep = currentStepIndex === steps.length - 1;
  const nextCh = getNextChapter(currentChapterId);
  const continueLabel = isLastStep
    ? nextCh
      ? `Next Chapter: ${nextCh.shortTitle} →`
      : 'Finish Walkthrough ✓'
    : 'Continue';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden select-none bg-[#F9F8F6] text-slate-800">
      
      {/* Header bar */}
      <Header showMiddleTitle={true} />

      {/* Main Split Layout */}
      <div className="flex-1 flex min-h-0 relative select-none">
        
        {/* Left Prose Sidebar */}
        <div style={{ width: `${leftPanelWidth}px` }} className="h-full flex-shrink-0 flex min-h-0 select-text">
          <TextPanel
            currentChapter={currentChapter}
            currentStepIndex={currentStepIndex}
            onStepSelect={handleStepSelect}
            onContinue={handleContinue}
            onSkip={handleSkip}
            onPrevChapter={handlePrevChapter}
            onNextChapter={handleNextChapter}
            hasPrevChapter={!!getPrevChapter(currentChapterId)}
            hasNextChapter={!!getNextChapter(currentChapterId)}
            continueLabel={continueLabel}
          />
        </div>

        {/* Draggable Resizer Bar */}
        <Resizer onResize={setLeftPanelWidth} minWidth={320} maxWidth={700} />

        {/* Right Canvas Area */}
        <div className="flex-1 h-full min-w-0 relative flex flex-col">
          {!isCompleted ? (
            <CanvasView
              activeNodes={currentStep?.activeNodes || []}
              activeEdges={currentStep?.activeEdges || []}
              highlightNodes={currentStep?.highlightNodes || []}
              highlightEdges={currentStep?.highlightEdges || []}
              cameraTarget={currentStep?.camera || { x: 0, y: 0, zoom: 0.85 }}
              annotations={currentStep?.annotations || []}
            />
          ) : (
            // Walkthrough completion panel
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-8 select-text">
              <div className="max-w-md text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-[#1B17FE] border border-[#1B17FE]/20 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  Walkthrough Complete!
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  You have successfully completed all 5 foundational chapters of the WayPoint AWS architecture walkthrough:
                </p>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-left text-xs font-mono text-slate-700 divide-y divide-gray-100">
                  <div className="py-1.5 flex justify-between"><span>1. IAM (Identity & Access)</span><span className="text-green-600 font-bold">✓</span></div>
                  <div className="py-1.5 flex justify-between"><span>2. VPC (Private Network)</span><span className="text-green-600 font-bold">✓</span></div>
                  <div className="py-1.5 flex justify-between"><span>3. EC2 (Compute Instance)</span><span className="text-green-600 font-bold">✓</span></div>
                  <div className="py-1.5 flex justify-between"><span>4. S3 (Object Storage)</span><span className="text-green-600 font-bold">✓</span></div>
                  <div className="py-1.5 flex justify-between"><span>5. CloudFront (Global CDN)</span><span className="text-green-600 font-bold">✓</span></div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="py-2.5 px-6 rounded-lg text-sm font-semibold bg-[#1B17FE] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-sans shadow"
                  >
                    Restart Path
                  </button>
                  <Link
                    href="/"
                    className="py-2.5 px-6 rounded-lg text-sm font-semibold border border-gray-300 text-slate-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all no-underline font-sans"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
