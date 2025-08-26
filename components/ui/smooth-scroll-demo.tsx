'use client';

import { useSmoothScroll } from './smooth-scroll';
import { Button } from './button';

export function SmoothScrollDemo() {
  const { scrollToElement, scrollToTop } = useSmoothScroll();

  return (
    <div className="fixed top-20 left-4 z-40 space-y-2">
      <Button
        onClick={() => scrollToTop()}
        variant="outline"
        size="sm"
        className="block w-full"
      >
        ↑ Top
      </Button>
      
      <Button
        onClick={() => scrollToElement('hero')}
        variant="outline"
        size="sm"
        className="block w-full"
      >
        Hero
      </Button>
      
      <Button
        onClick={() => scrollToElement('products')}
        variant="outline"
        size="sm"
        className="block w-full"
      >
        Products
      </Button>
      
      <Button
        onClick={() => scrollToElement('footer')}
        variant="outline"
        size="sm"
        className="block w-full"
      >
        Footer
      </Button>
    </div>
  );
}
