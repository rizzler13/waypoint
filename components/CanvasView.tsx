'use client';

import React, { useRef, useEffect, useState } from 'react';
import { CanvasRenderer } from '@/lib/canvas/renderer';
import { INITIAL_NODES, INITIAL_EDGES } from '@/lib/canvas/layout';
import { Annotation, CameraPosition } from '@/types';

interface CanvasViewProps {
  activeNodes: string[];
  activeEdges: string[];
  highlightNodes?: string[];
  highlightEdges?: string[];
  cameraTarget: CameraPosition;
  annotations?: Annotation[];
}

export default function CanvasView({
  activeNodes,
  activeEdges,
  highlightNodes = [],
  highlightEdges = [],
  cameraTarget,
  annotations = []
}: CanvasViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Initialize CanvasRenderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new CanvasRenderer(canvas);
    renderer.nodes = INITIAL_NODES;
    renderer.edges = INITIAL_EDGES;
    
    // Set selection callback
    renderer.onNodeClick = (nodeId) => {
      setSelectedNodeId(nodeId);
    };

    rendererRef.current = renderer;

    // Set up ResizeObserver to handle pane resizing
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      renderer.resize(width, height);
      renderer.fitToScreen(40);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      renderer.cleanupEvents();
      rendererRef.current = null;
    };
  }, []);

  // Update renderer state when props change
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    renderer.activeNodes = activeNodes;
    renderer.activeEdges = activeEdges;
    renderer.highlightNodes = highlightNodes;
    renderer.highlightEdges = highlightEdges;
    renderer.annotations = annotations;

    // Trigger smooth transition to the step's camera view
    renderer.setCameraTarget(cameraTarget);
  }, [activeNodes, activeEdges, highlightNodes, highlightEdges, cameraTarget, annotations]);

  // Center view on demand
  const handleRecenter = () => {
    if (rendererRef.current) {
      rendererRef.current.fitToScreen(45);
    }
  };

  const selectedNode = INITIAL_NODES.find(n => n.id === selectedNodeId);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-50 flex-1">
      {/* Underlying Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full select-none" />

      {/* Floating Canvas UI controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={handleRecenter}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all select-none focus:outline-none"
          title="Recenter Fit Screen"
        >
          {/* Recenter / Focus icon */}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Floating Info Drawer for clicked node properties */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 max-w-sm w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 transition-all font-sans">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1B17FE]"></span>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                {selectedNode.label}
              </h3>
            </div>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold font-sans"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              Type: {selectedNode.type.replace('-', ' ')}
            </p>
            {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-2 text-[11px] font-mono text-gray-700 space-y-1">
                {Object.entries(selectedNode.properties).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-dashed border-gray-150 pb-0.5 last:border-0 last:pb-0">
                    <span className="text-gray-400 mr-2">{k}:</span>
                    <span className="text-right truncate max-w-[160px]" title={v}>{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 italic">No details available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
