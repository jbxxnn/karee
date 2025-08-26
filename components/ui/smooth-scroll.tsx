'use client';

import { ReactNode } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

interface ScrollToOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export function SmoothScroll({ children, className, id }: SmoothScrollProps) {
  return (
    <div className={className} id={id}>
      {children}
    </div>
  );
}

// Utility function to scroll to an element smoothly
export function scrollToElement(
  elementId: string, 
  options: ScrollToOptions = {}
): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: options.behavior || 'smooth',
      block: options.block || 'start',
      inline: options.inline || 'nearest',
    });
  }
}

// Utility function to scroll to top smoothly
export function scrollToTop(options: ScrollToOptions = {}): void {
  window.scrollTo({
    top: 0,
    behavior: options.behavior || 'smooth',
  });
}

// Utility function to scroll to a specific position smoothly
export function scrollToPosition(
  x: number, 
  y: number, 
  options: ScrollToOptions = {}
): void {
  window.scrollTo({
    left: x,
    top: y,
    behavior: options.behavior || 'smooth',
  });
}

// Hook for smooth scrolling (if you want to use it in components)
export function useSmoothScroll() {
  return {
    scrollToElement,
    scrollToTop,
    scrollToPosition,
  };
}
