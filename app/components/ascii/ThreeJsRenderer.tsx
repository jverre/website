'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    THREE?: any;
    container?: HTMLDivElement;
    cleanup?: () => void;
    AsciiEffect?: any;
  }
}

interface ThreeJsRendererProps {
  threeJsCode: string;
}

const ThreeJsRenderer = ({ threeJsCode }: ThreeJsRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadThreeJs = async () => {
      if (!containerRef.current || !threeJsCode) return;

      // Make THREE and AsciiEffect available to the executed code
      window.THREE = THREE;
      window.AsciiEffect = AsciiEffect;
      
      // Set the container for the Three.js code to use
      const scaling_factor = 3;
      containerRef.current.style.width = `${319 * scaling_factor}px`;
      containerRef.current.style.height = `${300 * scaling_factor}px`;
      containerRef.current.style.transform = `scale(${1 / scaling_factor})`;
      containerRef.current.style.transformOrigin = 'top left';

      window.container = containerRef.current;
      
      // Create a function from the code string and execute it
      const executeThreeJsCode = new Function(threeJsCode);
      executeThreeJsCode();
      
      // Return cleanup function
      return () => {
        // Call the cleanup function if it was defined in the generated code
        if (typeof window.cleanup === 'function') {
          window.cleanup();
        }
        
        // Remove the container and other globals
        delete window.container;
        delete window.THREE;
        delete window.AsciiEffect;
      };
    };

    const cleanup = loadThreeJs();
    
    return () => {
      cleanup.then(cleanupFn => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, [threeJsCode]);
  
  return <div ref={containerRef} className="w-full h-[300px]" />;
};

export default ThreeJsRenderer; 